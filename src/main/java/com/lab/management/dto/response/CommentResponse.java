package com.lab.management.dto.response;

import com.lab.management.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private Long taskId;
    private Long authorId;
    private String authorName;
    private String authorEmail;
    private String authorPhotoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse fromEntity(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .taskId(comment.getTask().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .authorEmail(comment.getAuthor().getEmail())
                .authorPhotoUrl(comment.getAuthor().getPhotoUrl())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
