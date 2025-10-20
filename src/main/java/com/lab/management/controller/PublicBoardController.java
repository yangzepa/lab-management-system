package com.lab.management.controller;

import com.lab.management.dto.BoardCommentDTO;
import com.lab.management.dto.BoardDTO;
import com.lab.management.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicBoardController {

    private final BoardService boardService;

    // 공개 게시글 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<Page<BoardDTO>> getPublicBoards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BoardDTO> boards = boardService.getPublicBoards(page, size);
        return ResponseEntity.ok(boards);
    }

    // 게시글 상세 조회 (조회수 증가)
    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
        BoardDTO board = boardService.getBoardById(id);
        return ResponseEntity.ok(board);
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
}
