package com.marketplace.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull @Min(1) @Max(5)
    private Short rating;

    @Size(max = 2000)
    private String comment;
}
