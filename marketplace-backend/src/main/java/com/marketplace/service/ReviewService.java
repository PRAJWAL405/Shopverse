package com.marketplace.service;

import com.marketplace.domain.*;
import com.marketplace.dto.request.ReviewRequest;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.dto.response.ReviewResponse;
import com.marketplace.exception.*;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long productId, Long buyerId, ReviewRequest req) {
        if (reviewRepository.existsByProductIdAndBuyerId(productId, buyerId))
            throw new BadRequestException("You have already reviewed this product.");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
                .product(product)
                .buyer(buyer)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> pg = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        return PageResponse.<ReviewResponse>builder()
                .content(pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(pg.getNumber()).size(pg.getSize())
                .totalElements(pg.getTotalElements())
                .totalPages(pg.getTotalPages()).last(pg.isLast()).build();
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .buyerId(r.getBuyer().getId())
                .buyerName(r.getBuyer().getName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
