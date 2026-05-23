package com.marketplace.controller;

import com.marketplace.dto.request.ProductRequest;
import com.marketplace.dto.response.*;
import com.marketplace.repository.UserRepository;
import com.marketplace.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    // --- Dashboard ---
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(dashboardService.getSellerDashboard(userId(ud)));
    }

    // --- Products ---
    @GetMapping("/products")
    public ResponseEntity<PageResponse<ProductResponse>> myProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.getSellerProducts(userId(ud), page, size));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest req,
                                                   @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.createProduct(req, userId(ud)));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ProductRequest req,
                                                   @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.updateProduct(id, req, userId(ud)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails ud) {
        productService.deleteProduct(id, userId(ud));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products/{id}/images")
    public ResponseEntity<ProductResponse> uploadImages(@PathVariable Long id,
                                                         @RequestParam("files") List<MultipartFile> files,
                                                         @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.addImages(id, files, userId(ud)));
    }

    // --- Orders ---
    @GetMapping("/orders")
    public ResponseEntity<PageResponse<OrderResponse>> myOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.getSellerOrders(userId(ud), page, size));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
                                                       @RequestParam String status,
                                                       @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, userId(ud)));
    }

    private Long userId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
