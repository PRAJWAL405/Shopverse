package com.marketplace.service;

import com.marketplace.domain.Product;
import com.marketplace.dto.response.CartResponse;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ProductRepository productRepository;

    @Value("${app.cart.ttl-hours}")
    private int ttlHours;

    private final Map<String, Map<String, String>> fallbackCartMap = new java.util.concurrent.ConcurrentHashMap<>();

    private String cartKey(Long userId) { return "cart:" + userId; }

    private Map<Object, Object> getCartEntries(String key) {
        try {
            return redisTemplate.opsForHash().entries(key);
        } catch (Exception e) {
            Map<String, String> cart = fallbackCartMap.getOrDefault(key, Collections.emptyMap());
            return new HashMap<>(cart);
        }
    }

    private String getCartField(String key, String field) {
        try {
            Object val = redisTemplate.opsForHash().get(key, field);
            return val != null ? val.toString() : null;
        } catch (Exception e) {
            Map<String, String> cart = fallbackCartMap.get(key);
            return cart != null ? cart.get(field) : null;
        }
    }

    private void putCartField(String key, String field, String value) {
        try {
            redisTemplate.opsForHash().put(key, field, value);
            redisTemplate.expire(key, ttlHours, TimeUnit.HOURS);
        } catch (Exception e) {
            fallbackCartMap.computeIfAbsent(key, k -> new java.util.concurrent.ConcurrentHashMap<>()).put(field, value);
        }
    }

    private void deleteCartField(String key, String field) {
        try {
            redisTemplate.opsForHash().delete(key, field);
        } catch (Exception e) {
            Map<String, String> cart = fallbackCartMap.get(key);
            if (cart != null) {
                cart.remove(field);
            }
        }
    }

    private void deleteCart(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            fallbackCartMap.remove(key);
        }
    }

    public CartResponse getCart(Long userId) {
        String key = cartKey(userId);
        Map<Object, Object> raw = getCartEntries(key);
        List<CartResponse.CartItemResponse> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Object, Object> entry : raw.entrySet()) {
            Long productId = Long.parseLong(entry.getKey().toString());
            int qty = Integer.parseInt(entry.getValue().toString());
            productRepository.findById(productId).ifPresent(p -> {
                BigDecimal sub = p.getPrice().multiply(BigDecimal.valueOf(qty));
                String img = p.getImages().isEmpty() ? null : p.getImages().get(0).getUrl();
                items.add(CartResponse.CartItemResponse.builder()
                        .productId(p.getId())
                        .productName(p.getName())
                        .imageUrl(img)
                        .unitPrice(p.getPrice())
                        .quantity(qty)
                        .subtotal(sub)
                        .availableStock(p.getStockQty())
                        .build());
            });
        }

        BigDecimal subtotalSum = items.stream().map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingTotal = items.stream()
                .filter(i -> i.getUnitPrice().compareTo(BigDecimal.valueOf(500)) < 0)
                .map(i -> BigDecimal.valueOf(75).multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        total = subtotalSum.add(shippingTotal);

        return CartResponse.builder()
                .items(items)
                .total(total)
                .itemCount(items.stream().mapToInt(CartResponse.CartItemResponse::getQuantity).sum())
                .build();
    }

    public CartResponse addItem(Long userId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        if (!"ACTIVE".equals(product.getStatus()))
            throw new BadRequestException("Product is not available.");
        if (product.getStockQty() < quantity)
            throw new BadRequestException("Only " + product.getStockQty() + " items in stock.");

        String key = cartKey(userId);
        String existing = getCartField(key, String.valueOf(productId));
        int currentQty = existing == null ? 0 : Integer.parseInt(existing);
        int newQty = currentQty + quantity;
        if (product.getStockQty() < newQty)
            throw new BadRequestException("Cannot add " + quantity + " more — only " + product.getStockQty() + " in stock.");

        putCartField(key, String.valueOf(productId), String.valueOf(newQty));
        return getCart(userId);
    }

    public CartResponse updateItem(Long userId, Long productId, int quantity) {
        if (quantity <= 0) return removeItem(userId, productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        if (product.getStockQty() < quantity)
            throw new BadRequestException("Only " + product.getStockQty() + " items in stock.");

        String key = cartKey(userId);
        putCartField(key, String.valueOf(productId), String.valueOf(quantity));
        return getCart(userId);
    }

    public CartResponse removeItem(Long userId, Long productId) {
        deleteCartField(cartKey(userId), String.valueOf(productId));
        return getCart(userId);
    }

    public void clearCart(Long userId) {
        deleteCart(cartKey(userId));
    }

    public Map<Long, Integer> getCartItems(Long userId) {
        Map<Object, Object> raw = getCartEntries(cartKey(userId));
        return raw.entrySet().stream().collect(Collectors.toMap(
                e -> Long.parseLong(e.getKey().toString()),
                e -> Integer.parseInt(e.getValue().toString())
        ));
    }
}
