package com.lab.management.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subDir) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, subDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File stored successfully: {}", fileName);

            // Return relative URL
            return "/" + subDir + "/" + fileName;

        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return;
            }

            // Remove leading slash if present
            String filePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path path = Paths.get(uploadDir, filePath).toAbsolutePath().normalize();

            Files.deleteIfExists(path);
            log.info("File deleted successfully: {}", fileUrl);

        } catch (IOException ex) {
            log.error("Failed to delete file: {}", fileUrl, ex);
        }
    }
}
