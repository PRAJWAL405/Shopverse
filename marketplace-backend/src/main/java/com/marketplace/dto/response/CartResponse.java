package com.marketplace.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartResponse {
    private List<CartItemResponse> items;
    private BigDecimal total;
    private int itemCount;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CartItemResponse {
        private Long productId;
        private String productName;
        private String imageUrl;
        private BigDecimal unitPrice;
        private int quantity;
        private BigDecimal subtotal;
        private int availableStock;
    }
}
