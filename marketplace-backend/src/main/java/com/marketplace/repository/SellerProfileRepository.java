package com.marketplace.repository;

import com.marketplace.domain.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findByUserId(Long userId);
    boolean existsByShopName(String shopName);
}
