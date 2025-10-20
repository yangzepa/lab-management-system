package com.lab.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentDTO {
    private Long id;
    private String content;
    private Long boardId;
    private Long authorId;
    private String authorName;
    private String authorPhotoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
