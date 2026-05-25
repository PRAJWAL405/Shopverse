package com.marketplace.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CheckoutRequest {

    // Customer details
    @NotBlank
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank @Pattern(regexp = "\\d{10}")
    private String phone;

    // Shipping address (structured)
    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank @Pattern(regexp = "\\d{6}")
    private String pincode;

    // Payment
    @NotBlank @Pattern(regexp = "UPI|NET_BANKING|COD|EMI")
    private String paymentMethod;

    // UPI (required only if paymentMethod = UPI)
    private String upiId;

    // Net Banking (optional)
    private String bankName;
}
