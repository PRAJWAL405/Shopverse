package com.marketplace.service;

import com.marketplace.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    public String store(MultipartFile file) {
        if (file.isEmpty()) throw new BadRequestException("Cannot store empty file.");
        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.')) : "";
        String filename = UUID.randomUUID() + ext;

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new BadRequestException("Failed to store file: " + ex.getMessage());
        }
    }

    public void delete(String url) {
        try {
            String filename = url.replace("/uploads/", "");
            Path file = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            log.warn("Failed to delete file: {}", url);
        }
    }
}
