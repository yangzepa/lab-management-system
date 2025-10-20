package com.lab.management.controller;

import com.lab.management.dto.NoticeDTO;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserNoticeController {

    private final NoticeService noticeService;

    // 모든 공지 목록 조회 (공개+내부, 페이징) - 연구원도 조회 가능
    @GetMapping
    public ResponseEntity<Page<NoticeDTO>> getAllNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NoticeDTO> notices = noticeService.getAllNotices(page, size);
        return ResponseEntity.ok(notices);
    }

    // 공지 상세 조회 (공개+내부) - 연구원도 조회 가능
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }
}
