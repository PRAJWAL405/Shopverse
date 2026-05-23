package com.marketplace.service;

import com.marketplace.domain.*;
import com.marketplace.dto.request.ProductRequest;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.dto.response.ProductResponse;
import com.marketplace.exception.ForbiddenException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> searchProducts(Long categoryId, String keyword,
                                                        BigDecimal minPrice, BigDecimal maxPrice,
                                                        int page, int size, String sort) {
        Sort sortObj = switch (sort) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "newest"     -> Sort.by("createdAt").descending();
            default           -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Product> pg = productRepository.searchProducts(categoryId, keyword, minPrice, maxPrice, pageable);
        return toPageResponse(pg);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProduct(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return toResponse(p);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeatured() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc("ACTIVE")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getSellerProducts(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> pg = productRepository.findByStatusAndSellerId("ACTIVE", sellerId, pageable);
        return toPageResponse(pg);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest req, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));

        Product product = Product.builder()
                .seller(seller)
                .category(category)
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .stockQty(req.getStockQty())
                .status(req.getStatus())
                .build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest req, Long sellerId) {
        Product product = getOwnedProduct(productId, sellerId);
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStockQty(req.getStockQty());
        product.setStatus(req.getStatus());
        product.setCategory(category);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long productId, Long sellerId) {
        Product product = getOwnedProduct(productId, sellerId);
        product.setStatus("DELETED");
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse addImages(Long productId, List<MultipartFile> files, Long sellerId) {
        Product product = getOwnedProduct(productId, sellerId);
        int order = product.getImages().size();
        for (MultipartFile file : files) {
            String url = fileStorageService.store(file);
            ProductImage img = ProductImage.builder()
                    .product(product)
                    .url(url)
                    .displayOrder(order++)
                    .build();
            product.getImages().add(img);
        }
        return toResponse(productRepository.save(product));
    }

    private Product getOwnedProduct(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        if (!product.getSeller().getId().equals(sellerId))
            throw new ForbiddenException("You do not own this product.");
        return product;
    }

    private PageResponse<ProductResponse> toPageResponse(Page<Product> pg) {
        return PageResponse.<ProductResponse>builder()
                .content(pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(pg.getNumber())
                .size(pg.getSize())
                .totalElements(pg.getTotalElements())
                .totalPages(pg.getTotalPages())
                .last(pg.isLast())
                .build();
    }

    public ProductResponse toResponse(Product p) {
        Double avg = reviewRepository.findAverageRatingByProductId(p.getId());
        long cnt = reviewRepository.countByProductId(p.getId());
        List<String> images = p.getImages().stream()
                .map(ProductImage::getUrl).collect(Collectors.toList());
        String shopName = null;
        if (p.getSeller().getSellerProfile() != null)
            shopName = p.getSeller().getSellerProfile().getShopName();

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stockQty(p.getStockQty())
                .status(p.getStatus())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .sellerId(p.getSeller().getId())
                .sellerName(p.getSeller().getName())
                .shopName(shopName)
                .imageUrls(images)
                .averageRating(avg)
                .reviewCount(cnt)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
