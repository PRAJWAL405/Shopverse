package com.marketplace.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String status;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String cardLastFour;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private List<OrderItemResponse> items;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private String imageUrl;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        private String sellerName;
        private String shopName;
    }
}
