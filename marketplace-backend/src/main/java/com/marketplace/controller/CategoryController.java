package com.marketplace.controller;

import com.marketplace.dto.response.CategoryResponse;
import com.marketplace.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(
            categoryRepository.findRootCategoriesWithChildren()
                .stream().map(this::toResponse).collect(Collectors.toList())
        );
    }

    private CategoryResponse toResponse(com.marketplace.domain.Category c) {
        List<CategoryResponse> children = c.getChildren().stream()
                .map(child -> CategoryResponse.builder()
                        .id(child.getId()).name(child.getName())
                        .slug(child.getSlug()).description(child.getDescription())
                        .imageUrl(child.getImageUrl())
                        .parentId(c.getId()).build())
                .collect(Collectors.toList());
        return CategoryResponse.builder()
                .id(c.getId()).name(c.getName()).slug(c.getSlug())
                .description(c.getDescription()).imageUrl(c.getImageUrl())
                .children(children).build();
    }
}
