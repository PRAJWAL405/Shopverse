package com.marketplace.repository;

import com.marketplace.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByStatusAndSellerId(String status, Long sellerId, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.status = 'ACTIVE'
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """)
    Page<Product> searchProducts(
        @Param("categoryId") Long categoryId,
        @Param("keyword") String keyword,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    List<Product> findTop8ByStatusOrderByCreatedAtDesc(String status);

    long countBySellerIdAndStatus(Long sellerId, String status);
}
