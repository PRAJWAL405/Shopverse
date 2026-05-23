package com.marketplace.controller;

import com.marketplace.dto.request.ProductRequest;
import com.marketplace.dto.request.ReviewRequest;
import com.marketplace.dto.response.*;
import com.marketplace.repository.CategoryRepository;
import com.marketplace.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;
    private final CategoryRepository categoryRepository;
    private final com.marketplace.repository.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> browse(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort) {
        return ResponseEntity.ok(productService.searchProducts(categoryId, keyword, minPrice, maxPrice, page, size, sort));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> featured() {
        return ResponseEntity.ok(productService.getFeatured());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<PageResponse<ReviewResponse>> getReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getProductReviews(id, page, size));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(reviewService.createReview(id, userId, req));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
