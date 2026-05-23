package com.marketplace.repository;

import com.marketplace.domain.Order;
import com.marketplace.domain.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId, Pageable pageable);

    @Query("""
        SELECT DISTINCT o FROM Order o
        JOIN o.items i
        WHERE i.seller.id = :sellerId
        ORDER BY o.createdAt DESC
    """)
    Page<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    @Query("""
        SELECT COUNT(DISTINCT o.id) FROM Order o
        JOIN o.items i
        WHERE i.seller.id = :sellerId
        AND o.status = :status
    """)
    long countSellerOrdersByStatus(@Param("sellerId") Long sellerId, @Param("status") OrderStatus status);

    @Query("""
        SELECT COALESCE(SUM(i.subtotal), 0) FROM OrderItem i
        WHERE i.seller.id = :sellerId
        AND i.order.createdAt >= :since
    """)
    BigDecimal sumSellerRevenueSince(@Param("sellerId") Long sellerId, @Param("since") ZonedDateTime since);
}
