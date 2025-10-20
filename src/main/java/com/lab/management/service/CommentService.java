package com.lab.management.service;

import com.lab.management.dto.request.CommentRequest;
import com.lab.management.dto.response.CommentResponse;
import com.lab.management.entity.Comment;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.Task;
import com.lab.management.repository.CommentRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ResearcherRepository researcherRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTaskId(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(Long taskId, Long authorId, CommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        Researcher author = researcherRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Researcher not found with id: " + authorId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(savedComment);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, Long authorId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        // 작성자만 수정 가능
        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long authorId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        // 작성자 또는 관리자만 삭제 가능
        if (!isAdmin && !comment.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
