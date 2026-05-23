package com.marketplace.repository;

import com.marketplace.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        SELECT i.product.id, i.product.name, SUM(i.quantity) as totalQty, SUM(i.subtotal) as revenue
        FROM OrderItem i
        WHERE i.seller.id = :sellerId
        GROUP BY i.product.id, i.product.name
        ORDER BY revenue DESC
    """)
    List<Object[]> findTopProductsBySellerId(@Param("sellerId") Long sellerId);
}
