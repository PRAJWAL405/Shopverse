package com.marketplace.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank @Size(max = 255)
    private String name;

    private String description;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stockQty;

    @NotNull
    private Long categoryId;

    private String status = "ACTIVE";
}
