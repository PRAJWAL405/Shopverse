package com.marketplace.service;

import com.marketplace.domain.*;
import com.marketplace.dto.request.LoginRequest;
import com.marketplace.dto.request.RegisterRequest;
import com.marketplace.dto.response.AuthResponse;
import com.marketplace.exception.BadRequestException;
import com.marketplace.repository.SellerProfileRepository;
import com.marketplace.repository.UserRepository;
import com.marketplace.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }

        Role role;
        try {
            role = Role.valueOf(req.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be BUYER or SELLER.");
        }
        if (role == Role.ADMIN) throw new BadRequestException("Cannot self-register as ADMIN.");

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .enabled(true)
                .emailVerified(false)
                .build();
        user = userRepository.save(user);

        String shopName = null;
        if (role == Role.SELLER) {
            if (req.getShopName() == null || req.getShopName().isBlank())
                throw new BadRequestException("Shop name is required for SELLER registration.");
            if (sellerProfileRepository.existsByShopName(req.getShopName()))
                throw new BadRequestException("Shop name already taken: " + req.getShopName());

            SellerProfile profile = SellerProfile.builder()
                    .user(user)
                    .shopName(req.getShopName())
                    .description(req.getShopDescription())
                    .approved(true) // auto-approve for simplicity
                    .build();
            sellerProfileRepository.save(profile);
            shopName = profile.getShopName();
        }

        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
        return buildAuthResponse(user, token, shopName);
    }

    public AuthResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String shopName = null;
        if (user.getRole() == Role.SELLER) {
            shopName = sellerProfileRepository.findByUserId(user.getId())
                    .map(SellerProfile::getShopName).orElse(null);
        }
        return buildAuthResponse(user, token, shopName);
    }

    private AuthResponse buildAuthResponse(User user, String token, String shopName) {
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .shopName(shopName)
                .build();
    }
}
