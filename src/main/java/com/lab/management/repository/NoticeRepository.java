package com.lab.management.repository;

import com.lab.management.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 공개 공지만 조회 (최신순)
    List<Notice> findByIsPublicTrueOrderByCreatedAtDesc();

    // 공개 공지만 조회 (페이징)
    Page<Notice> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);

    // 모든 공지 조회 (최신순, 페이징)
    Page<Notice> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
