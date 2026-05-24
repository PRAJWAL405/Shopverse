package com.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderActionRequest {
    @NotBlank
    private String reason;
}
