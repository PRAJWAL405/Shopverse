package com.marketplace.controller;

import com.marketplace.dto.request.CheckoutRequest;
import com.marketplace.dto.response.OrderResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.repository.UserRepository;
import com.marketplace.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@Valid @RequestBody CheckoutRequest req,
                                                   @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.placeOrder(userId(ud), req));
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> myOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.getBuyerOrders(userId(ud), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.getOrder(id, userId(ud)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancel(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.cancelOrder(id, userId(ud)));
    }

    private Long userId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
