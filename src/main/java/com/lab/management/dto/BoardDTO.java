package com.lab.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {
    private Long id;
    private String title;
    private String content;
    private Boolean isPublic;
    private String imageUrl;
    private String attachmentUrl;
    private String attachmentName;
    private Long authorId;
    private String authorName;
    private Integer viewCount;
    private Integer commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
