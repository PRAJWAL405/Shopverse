package com.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotBlank
    private String shippingAddress;

    @NotBlank @Size(min = 16, max = 16) @Pattern(regexp = "\\d+")
    private String cardNumber;

    @NotBlank @Pattern(regexp = "\\d{2}/\\d{2}")
    private String expiryDate;

    @NotBlank @Pattern(regexp = "\\d{3,4}")
    private String cvv;

    @NotBlank
    private String cardHolderName;
}
