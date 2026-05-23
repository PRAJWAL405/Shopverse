package com.marketplace.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private long totalOrders;
    private long pendingOrders;
    private long activeProducts;
    private List<TopProduct> topProducts;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopProduct {
        private Long productId;
        private String productName;
        private long totalQtySold;
        private BigDecimal revenue;
    }
}
