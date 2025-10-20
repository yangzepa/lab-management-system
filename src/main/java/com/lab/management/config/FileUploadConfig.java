package com.lab.management.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String fileLocation = "file:" + uploadPath.toString() + "/";

        log.info("========================================");
        log.info("Configuring static resource handlers:");
        log.info("Upload directory: {}", uploadPath);
        log.info("File location: {}", fileLocation);
        log.info("========================================");

        // /files/** 경로로 업로드된 파일 제공 (컨트롤러에서 반환하는 URL과 일치)
        registry.addResourceHandler("/files/**")
                .addResourceLocations(fileLocation);
        log.info("Registered /files/** -> {}", fileLocation);

        // 하위 호환성을 위해 /uploads/** 경로도 유지
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileLocation);
        log.info("Registered /uploads/** -> {}", fileLocation);
    }

    public String getUploadDir() {
        return uploadDir;
    }
}
