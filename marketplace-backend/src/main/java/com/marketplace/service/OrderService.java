package com.marketplace.service;

import com.marketplace.domain.*;
import com.marketplace.dto.request.CheckoutRequest;
import com.marketplace.dto.response.OrderResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.exception.*;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final EmailService emailService;

    @Transactional
    @Retryable(retryFor = OptimisticLockingFailureException.class, maxAttempts = 3,
               backoff = @Backoff(delay = 100, multiplier = 2))
    public OrderResponse placeOrder(Long buyerId, CheckoutRequest req) {
        Map<Long, Integer> cartItems = cartService.getCartItems(buyerId);
        if (cartItems.isEmpty()) throw new BadRequestException("Cart is empty.");

        // Simulate payment: 80% success rate
        boolean paymentSuccess = Math.random() < 0.8;
        String paymentStatus = paymentSuccess ? "PAID" : "FAILED";
        if (!paymentSuccess) throw new PaymentFailedException("Payment declined. Please try again.");

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : cartItems.entrySet()) {
            Long productId = entry.getKey();
            int qty = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            if (!"ACTIVE".equals(product.getStatus()))
                throw new BadRequestException("Product '" + product.getName() + "' is no longer available.");
            if (product.getStockQty() < qty)
                throw new OutOfStockException("Insufficient stock for: " + product.getName()
                        + " (requested: " + qty + ", available: " + product.getStockQty() + ")");

            // Deduct stock — triggers OptimisticLockException if concurrent update
            product.setStockQty(product.getStockQty() - qty);
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(qty));
            total = total.add(subtotal);

            orderItems.add(OrderItem.builder()
                    .product(product)
                    .seller(product.getSeller())
                    .quantity(qty)
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .build());
        }

        Order order = Order.builder()
                .buyer(buyer)
                .status(OrderStatus.PLACED)
                .totalAmount(total)
                .paymentStatus(paymentStatus)
                .shippingAddress(req.getShippingAddress())
                .cardLastFour(req.getCardNumber().substring(req.getCardNumber().length() - 4))
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        cartService.clearCart(buyerId);
        emailService.sendOrderConfirmation(buyer.getEmail(), saved.getId());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getBuyerOrders(Long buyerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> pg = orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId, pageable);
        return toPageResponse(pg);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        // Buyers see their own orders; sellers can see orders with their items
        boolean isBuyer = order.getBuyer().getId().equals(userId);
        boolean isSeller = order.getItems().stream().anyMatch(i -> i.getSeller().getId().equals(userId));
        if (!isBuyer && !isSeller) throw new ForbiddenException("Access denied.");
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus, Long sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        boolean sellerHasItems = order.getItems().stream()
                .anyMatch(i -> i.getSeller().getId().equals(sellerId));
        if (!sellerHasItems) throw new ForbiddenException("You have no items in this order.");

        OrderStatus next = parseStatus(newStatus);
        validateTransition(order.getStatus(), next);
        order.setStatus(next);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
        if (!order.getBuyer().getId().equals(buyerId)) throw new ForbiddenException("Access denied.");
        if (order.getStatus() != OrderStatus.PLACED)
            throw new OrderStateException("Can only cancel PLACED orders.");

        // Restore stock
        order.getItems().forEach(item -> {
            Product p = item.getProduct();
            p.setStockQty(p.getStockQty() + item.getQuantity());
            productRepository.save(p);
        });
        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getSellerOrders(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> pg = orderRepository.findOrdersBySellerId(sellerId, pageable);
        return toPageResponse(pg);
    }

    private OrderStatus parseStatus(String status) {
        try { return OrderStatus.valueOf(status.toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + status); }
    }

    private void validateTransition(OrderStatus current, OrderStatus next) {
        Map<OrderStatus, List<OrderStatus>> allowed = Map.of(
                OrderStatus.PLACED,     List.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
                OrderStatus.CONFIRMED,  List.of(OrderStatus.SHIPPED),
                OrderStatus.SHIPPED,    List.of(OrderStatus.DELIVERED)
        );
        List<OrderStatus> valid = allowed.getOrDefault(current, List.of());
        if (!valid.contains(next))
            throw new OrderStateException("Cannot transition from " + current + " to " + next);
    }

    private PageResponse<OrderResponse> toPageResponse(Page<Order> pg) {
        return PageResponse.<OrderResponse>builder()
                .content(pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(pg.getNumber()).size(pg.getSize())
                .totalElements(pg.getTotalElements())
                .totalPages(pg.getTotalPages()).last(pg.isLast()).build();
    }

    private OrderResponse toResponse(Order o) {
        List<OrderResponse.OrderItemResponse> items = o.getItems().stream().map(item -> {
            String img = item.getProduct().getImages().isEmpty() ? null
                    : item.getProduct().getImages().get(0).getUrl();
            String shopName = item.getSeller().getSellerProfile() != null
                    ? item.getSeller().getSellerProfile().getShopName() : null;
            return OrderResponse.OrderItemResponse.builder()
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .imageUrl(img)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subtotal(item.getSubtotal())
                    .sellerName(item.getSeller().getName())
                    .shopName(shopName)
                    .build();
        }).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(o.getId()).status(o.getStatus().name())
                .paymentStatus(o.getPaymentStatus())
                .totalAmount(o.getTotalAmount())
                .shippingAddress(o.getShippingAddress())
                .cardLastFour(o.getCardLastFour())
                .createdAt(o.getCreatedAt()).updatedAt(o.getUpdatedAt())
                .items(items).build();
    }
}
