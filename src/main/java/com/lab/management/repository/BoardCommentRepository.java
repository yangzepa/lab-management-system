package com.lab.management.repository;

import com.lab.management.entity.BoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    // 특정 게시글의 댓글 조회
    List<BoardComment> findByBoardIdOrderByCreatedAtAsc(Long boardId);

    // 특정 작성자의 댓글 조회
    List<BoardComment> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
