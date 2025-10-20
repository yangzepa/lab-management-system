package com.lab.management.repository;

import com.lab.management.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    // 공개 게시글 조회 (페이징)
    Page<Board> findByIsPublicTrue(Pageable pageable);

    // 모든 게시글 조회 (페이징)
    Page<Board> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 작성자별 게시글 조회
    List<Board> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    // 제목으로 검색
    Page<Board> findByTitleContainingOrderByCreatedAtDesc(String keyword, Pageable pageable);
}
