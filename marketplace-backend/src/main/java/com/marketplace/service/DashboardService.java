package com.marketplace.service;

import com.marketplace.domain.OrderStatus;
import com.marketplace.dto.response.DashboardResponse;
import com.marketplace.repository.OrderItemRepository;
import com.marketplace.repository.OrderRepository;
import com.marketplace.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getSellerDashboard(Long sellerId) {
        ZonedDateTime monthStart = ZonedDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        ZonedDateTime epoch = ZonedDateTime.now().minusYears(10);

        BigDecimal totalRevenue = orderRepository.sumSellerRevenueSince(sellerId, epoch);
        BigDecimal monthRevenue = orderRepository.sumSellerRevenueSince(sellerId, monthStart);
        long totalOrders = orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.PLACED)
                + orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.CONFIRMED)
                + orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.SHIPPED)
                + orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.DELIVERED);
        long pending = orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.PLACED)
                + orderRepository.countSellerOrdersByStatus(sellerId, OrderStatus.CONFIRMED);
        long activeProducts = productRepository.countBySellerIdAndStatus(sellerId, "ACTIVE");

        List<Object[]> topRaw = orderItemRepository.findTopProductsBySellerId(sellerId);
        List<DashboardResponse.TopProduct> topProducts = topRaw.stream().limit(5).map(row ->
                DashboardResponse.TopProduct.builder()
                        .productId(((Number) row[0]).longValue())
                        .productName((String) row[1])
                        .totalQtySold(((Number) row[2]).longValue())
                        .revenue((BigDecimal) row[3])
                        .build()
        ).collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .revenueThisMonth(monthRevenue != null ? monthRevenue : BigDecimal.ZERO)
                .totalOrders(totalOrders)
                .pendingOrders(pending)
                .activeProducts(activeProducts)
                .topProducts(topProducts)
                .build();
    }
}
