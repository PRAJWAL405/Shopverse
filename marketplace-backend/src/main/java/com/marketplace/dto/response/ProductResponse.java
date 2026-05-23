package com.marketplace.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQty;
    private String status;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private String shopName;
    private List<String> imageUrls;
    private Double averageRating;
    private Long reviewCount;
    private ZonedDateTime createdAt;
}
