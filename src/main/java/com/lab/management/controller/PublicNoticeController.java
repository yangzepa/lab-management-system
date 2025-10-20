package com.lab.management.controller;

import com.lab.management.dto.NoticeDTO;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicNoticeController {

    private final NoticeService noticeService;

    // 공개 공지 최신 N개 조회 (랜딩페이지용)
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<NoticeDTO>>> getLatestPublicNotices(
            @RequestParam(defaultValue = "5") int limit) {
        List<NoticeDTO> notices = noticeService.getPublicNotices(limit);
        return ResponseEntity.ok(ApiResponse.success(notices));
    }

    // 공개 공지 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<NoticeDTO>>> getPublicNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NoticeDTO> notices = noticeService.getPublicNotices(page, size);
        return ResponseEntity.ok(ApiResponse.success(notices));
    }

    // 공개 공지 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoticeDTO>> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id);
        // 공개 공지만 조회 가능
        if (!notice.getIsPublic()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.success(notice));
    }
}
