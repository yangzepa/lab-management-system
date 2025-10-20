package com.lab.management.controller;

import com.lab.management.dto.BoardCommentDTO;
import com.lab.management.dto.BoardDTO;
import com.lab.management.dto.CreateBoardRequest;
import com.lab.management.dto.CreateCommentRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserBoardController {

    private final BoardService boardService;

    // 모든 게시글 목록 조회 (공개+내부, 페이징)
    @GetMapping
    public ResponseEntity<Page<BoardDTO>> getAllBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BoardDTO> boards = boardService.getAllBoards(page, size);
        return ResponseEntity.ok(boards);
    }

    // 게시글 상세 조회 (조회수 증가)
    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
        BoardDTO board = boardService.getBoardById(id);
        return ResponseEntity.ok(board);
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<ApiResponse<BoardDTO>> createBoard(
            @Valid @RequestBody CreateBoardRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        BoardDTO createdBoard = boardService.createBoard(request, username);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Board created successfully", createdBoard));
    }

    // 게시글 수정 (작성자 본인만)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardDTO>> updateBoard(
            @PathVariable Long id,
            @Valid @RequestBody CreateBoardRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        BoardDTO updatedBoard = boardService.updateBoard(id, request, username);
        return ResponseEntity.ok(ApiResponse.success("Board updated successfully", updatedBoard));
    }

    // 게시글 삭제 (작성자 본인만)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBoard(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        boardService.deleteBoard(id, username);
        return ResponseEntity.ok(ApiResponse.success("Board deleted successfully", null));
    }

    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<BoardDTO>> searchBoards(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BoardDTO> boards = boardService.searchBoards(keyword, page, size);
        return ResponseEntity.ok(boards);
    }

    // 특정 게시글의 댓글 조회
    @GetMapping("/{boardId}/comments")
    public ResponseEntity<List<BoardCommentDTO>> getBoardComments(@PathVariable Long boardId) {
        List<BoardCommentDTO> comments = boardService.getBoardComments(boardId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성
    @PostMapping("/{boardId}/comments")
    public ResponseEntity<ApiResponse<BoardCommentDTO>> createComment(
            @PathVariable Long boardId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        BoardCommentDTO createdComment = boardService.createComment(boardId, request, username);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", createdComment));
    }

    // 댓글 수정 (작성자 본인만)
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<BoardCommentDTO>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        BoardCommentDTO updatedComment = boardService.updateComment(commentId, request, username);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", updatedComment));
    }

    // 댓글 삭제 (작성자 본인만)
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        String username = authentication.getName();
        boardService.deleteComment(commentId, username);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
