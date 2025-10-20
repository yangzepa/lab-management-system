package com.lab.management.controller;

import com.lab.management.dto.CreateNoticeRequest;
import com.lab.management.dto.NoticeDTO;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminNoticeController {

    private final NoticeService noticeService;

    // 모든 공지 목록 조회 (공개+내부, 페이징)
    @GetMapping
    public ResponseEntity<Page<NoticeDTO>> getAllNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NoticeDTO> notices = noticeService.getAllNotices(page, size);
        return ResponseEntity.ok(notices);
    }

    // 공지 상세 조회 (공개+내부)
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    // 공지 작성 (모든 멤버 가능)
    @PostMapping
    public ResponseEntity<ApiResponse<NoticeDTO>> createNotice(
            @Valid @RequestBody CreateNoticeRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        NoticeDTO createdNotice = noticeService.createNotice(request, username);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notice created successfully", createdNotice));
    }

    // 공지 수정 (작성자 또는 관리자)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoticeDTO>> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody CreateNoticeRequest request,
            Authentication authentication) {
        String username = authentication.getName();

        // 관리자는 모든 공지 수정 가능
        try {
            NoticeDTO updatedNotice = noticeService.updateNotice(id, request, username);
            return ResponseEntity.ok(ApiResponse.success("Notice updated successfully", updatedNotice));
        } catch (RuntimeException e) {
            // 작성자가 아닌 경우, 관리자 권한으로 수정 시도
            NoticeDTO updatedNotice = noticeService.updateNoticeByAdmin(id, request);
            return ResponseEntity.ok(ApiResponse.success("Notice updated successfully", updatedNotice));
        }
    }

    // 공지 삭제 (작성자 또는 관리자)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotice(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();

        // 관리자는 모든 공지 삭제 가능
        try {
            noticeService.deleteNotice(id, username);
        } catch (RuntimeException e) {
            // 작성자가 아닌 경우, 관리자 권한으로 삭제 시도
            noticeService.deleteNoticeByAdmin(id);
        }

        return ResponseEntity.ok(ApiResponse.success("Notice deleted successfully", null));
    }
}
