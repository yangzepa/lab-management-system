package com.lab.management.service;

import com.lab.management.dto.BoardCommentDTO;
import com.lab.management.dto.BoardDTO;
import com.lab.management.dto.CreateBoardRequest;
import com.lab.management.dto.CreateCommentRequest;
import com.lab.management.entity.Board;
import com.lab.management.entity.BoardComment;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.User;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.BoardCommentRepository;
import com.lab.management.repository.BoardRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final ResearcherRepository researcherRepository;
    private final UserRepository userRepository;

    // 공개 게시글 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<BoardDTO> getPublicBoards(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Board> boardPage = boardRepository.findByIsPublicTrue(pageable);
        return boardPage.map(this::convertToDTO);
    }

    // 모든 게시글 목록 조회 (페이징, 관리자/멤버용)
    @Transactional(readOnly = true)
    public Page<BoardDTO> getAllBoards(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Board> boardPage = boardRepository.findAllByOrderByCreatedAtDesc(pageable);
        return boardPage.map(this::convertToDTO);
    }

    // 게시글 상세 조회 (조회수 증가)
    @Transactional
    public BoardDTO getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));

        // 조회수 증가
        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);

        return convertToDTO(board);
    }

    // 게시글 작성 (모든 멤버 가능)
    @Transactional
    public BoardDTO createBoard(CreateBoardRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher author = user.getResearcher();
        if (author == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .isPublic(request.getIsPublic())
                .imageUrl(request.getImageUrl())
                .attachmentUrl(request.getAttachmentUrl())
                .attachmentName(request.getAttachmentName())
                .author(author)
                .viewCount(0)
                .build();

        Board savedBoard = boardRepository.save(board);
        return convertToDTO(savedBoard);
    }

    // 게시글 수정 (작성자 본인만)
    @Transactional
    public BoardDTO updateBoard(Long id, CreateBoardRequest request, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));

        // 작성자 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!board.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only edit your own posts");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setIsPublic(request.getIsPublic());
        board.setImageUrl(request.getImageUrl());
        board.setAttachmentUrl(request.getAttachmentUrl());
        board.setAttachmentName(request.getAttachmentName());

        Board updatedBoard = boardRepository.save(board);
        return convertToDTO(updatedBoard);
    }

    // 게시글 삭제 (작성자 본인만)
    @Transactional
    public void deleteBoard(Long id, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));

        // 작성자 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!board.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }

        boardRepository.delete(board);
    }

    // 관리자용 게시글 수정 (작성자 확인 없음)
    @Transactional
    public BoardDTO updateBoardByAdmin(Long id, CreateBoardRequest request) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setIsPublic(request.getIsPublic());
        board.setImageUrl(request.getImageUrl());
        board.setAttachmentUrl(request.getAttachmentUrl());
        board.setAttachmentName(request.getAttachmentName());

        Board updatedBoard = boardRepository.save(board);
        return convertToDTO(updatedBoard);
    }

    // 관리자용 게시글 삭제 (작성자 확인 없음)
    @Transactional
    public void deleteBoardByAdmin(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));
        boardRepository.delete(board);
    }

    // 게시글 검색
    @Transactional(readOnly = true)
    public Page<BoardDTO> searchBoards(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Board> boardPage = boardRepository.findByTitleContainingOrderByCreatedAtDesc(keyword, pageable);
        return boardPage.map(this::convertToDTO);
    }

    // 특정 게시글의 댓글 조회
    @Transactional(readOnly = true)
    public List<BoardCommentDTO> getBoardComments(Long boardId) {
        List<BoardComment> comments = boardCommentRepository.findByBoardIdOrderByCreatedAtAsc(boardId);
        return comments.stream()
                .map(this::convertCommentToDTO)
                .collect(Collectors.toList());
    }

    // 댓글 작성
    @Transactional
    public BoardCommentDTO createComment(Long boardId, CreateCommentRequest request, String username) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", boardId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher author = user.getResearcher();
        if (author == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        BoardComment comment = BoardComment.builder()
                .content(request.getContent())
                .board(board)
                .author(author)
                .build();

        BoardComment savedComment = boardCommentRepository.save(comment);
        return convertCommentToDTO(savedComment);
    }

    // 댓글 수정
    @Transactional
    public BoardCommentDTO updateComment(Long commentId, CreateCommentRequest request, String username) {
        BoardComment comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("BoardComment", "id", commentId));

        // 작성자 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        BoardComment updatedComment = boardCommentRepository.save(comment);
        return convertCommentToDTO(updatedComment);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId, String username) {
        BoardComment comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("BoardComment", "id", commentId));

        // 작성자 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own comments");
        }

        boardCommentRepository.delete(comment);
    }

    // 관리자용 댓글 삭제 (작성자 확인 없음)
    @Transactional
    public void deleteCommentByAdmin(Long commentId) {
        BoardComment comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("BoardComment", "id", commentId));
        boardCommentRepository.delete(comment);
    }

    // Entity to DTO (Board)
    private BoardDTO convertToDTO(Board board) {
        BoardDTO dto = new BoardDTO();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setIsPublic(board.getIsPublic());
        dto.setImageUrl(board.getImageUrl());
        dto.setAttachmentUrl(board.getAttachmentUrl());
        dto.setAttachmentName(board.getAttachmentName());
        dto.setAuthorId(board.getAuthor().getId());
        dto.setAuthorName(board.getAuthor().getName());
        dto.setViewCount(board.getViewCount());
        dto.setCommentCount(board.getComments().size());
        dto.setCreatedAt(board.getCreatedAt());
        dto.setUpdatedAt(board.getUpdatedAt());
        return dto;
    }

    // Entity to DTO (BoardComment)
    private BoardCommentDTO convertCommentToDTO(BoardComment comment) {
        BoardCommentDTO dto = new BoardCommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setBoardId(comment.getBoard().getId());
        dto.setAuthorId(comment.getAuthor().getId());
        dto.setAuthorName(comment.getAuthor().getName());
        dto.setAuthorPhotoUrl(comment.getAuthor().getPhotoUrl());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
