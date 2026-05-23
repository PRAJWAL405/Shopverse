package com.marketplace.dto.response;

import lombok.*;
import java.time.ZonedDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long buyerId;
    private String buyerName;
    private short rating;
    private String comment;
    private ZonedDateTime createdAt;
}
