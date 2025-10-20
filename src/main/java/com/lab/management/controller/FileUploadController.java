package com.lab.management.controller;

import com.lab.management.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/admin/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        log.info("Starting image upload. File name: {}, Size: {} bytes",
                file.getOriginalFilename(), file.getSize());

        try {
            if (file.isEmpty()) {
                log.warn("Upload failed: File is empty");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("파일이 비어있습니다."));
            }

            // 파일 확장자 추출
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : "";

            log.debug("File extension: {}", extension);

            // 확장자 제한 제거됨 - 모든 파일 타입 허용

            // 파일 저장 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            log.info("Upload directory (absolute): {}", uploadPath);

            if (!Files.exists(uploadPath)) {
                log.info("Creating upload directory: {}", uploadPath);
                Files.createDirectories(uploadPath);
            }

            // 고유한 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            log.info("Saving file to: {}", filePath.toAbsolutePath());

            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 반환 - context path (/api) 포함
            String fileUrl = "/api/files/" + filename;

            log.info("File uploaded successfully: {} -> {}", originalFilename, fileUrl);
            return ResponseEntity.ok(ApiResponse.success(fileUrl));

        } catch (IOException e) {
            log.error("Failed to upload file: {} - Error: {}",
                    file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("파일 업로드에 실패했습니다: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {} - Error: {}",
                    file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/file")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Starting file upload. File name: {}, Size: {} bytes",
                file.getOriginalFilename(), file.getSize());

        try {
            if (file.isEmpty()) {
                log.warn("Upload failed: File is empty");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("파일이 비어있습니다."));
            }

            // 파일 확장자 추출
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : "";

            log.debug("File extension: {}", extension);

            // 확장자 제한 제거됨 - 모든 파일 타입 허용

            // 파일 크기 검증 (10MB 제한)
            if (file.getSize() > 10 * 1024 * 1024) {
                log.warn("Upload failed: File too large - {} bytes", file.getSize());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("파일 크기는 10MB를 초과할 수 없습니다."));
            }

            // 파일 저장 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            log.info("Upload directory (absolute): {}", uploadPath);

            if (!Files.exists(uploadPath)) {
                log.info("Creating upload directory: {}", uploadPath);
                Files.createDirectories(uploadPath);
            }

            // 고유한 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            log.info("Saving file to: {}", filePath.toAbsolutePath());

            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 및 원본 파일명 반환
            String fileUrl = "/api/files/" + filename;
            Map<String, String> result = new HashMap<>();
            result.put("fileUrl", fileUrl);
            result.put("originalName", originalFilename);

            log.info("File uploaded successfully: {} -> {}", originalFilename, fileUrl);
            return ResponseEntity.ok(ApiResponse.success(result));

        } catch (IOException e) {
            log.error("Failed to upload file: {} - Error: {}",
                    file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("파일 업로드에 실패했습니다: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {} - Error: {}",
                    file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("파일 업로드 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    private boolean isValidImageExtension(String extension) {
        return extension.equalsIgnoreCase(".jpg") ||
               extension.equalsIgnoreCase(".jpeg") ||
               extension.equalsIgnoreCase(".png") ||
               extension.equalsIgnoreCase(".gif");
    }

    private boolean isValidFileExtension(String extension) {
        return extension.equalsIgnoreCase(".pdf") ||
               extension.equalsIgnoreCase(".doc") ||
               extension.equalsIgnoreCase(".docx") ||
               extension.equalsIgnoreCase(".txt") ||
               extension.equalsIgnoreCase(".xls") ||
               extension.equalsIgnoreCase(".xlsx") ||
               extension.equalsIgnoreCase(".ppt") ||
               extension.equalsIgnoreCase(".pptx") ||
               extension.equalsIgnoreCase(".zip");
    }
}
