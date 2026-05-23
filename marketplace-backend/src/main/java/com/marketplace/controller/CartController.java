package com.marketplace.controller;

import com.marketplace.dto.request.CartItemRequest;
import com.marketplace.dto.response.CartResponse;
import com.marketplace.repository.UserRepository;
import com.marketplace.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.getCart(userId(ud)));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@Valid @RequestBody CartItemRequest req,
                                                 @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.addItem(userId(ud), req.getProductId(), req.getQuantity()));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(@PathVariable Long productId,
                                                    @Valid @RequestBody CartItemRequest req,
                                                    @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.updateItem(userId(ud), productId, req.getQuantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long productId,
                                                    @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.removeItem(userId(ud), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails ud) {
        cartService.clearCart(userId(ud));
        return ResponseEntity.noContent().build();
    }

    private Long userId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
