package com.lab.management.controller;

import com.lab.management.dto.AnnouncementResponse;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/announcements")
@RequiredArgsConstructor
public class PublicAnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getPublicAnnouncements() {
        List<AnnouncementResponse> announcements = announcementService.getPublicAnnouncements();
        return ResponseEntity.ok(ApiResponse.success(announcements));
    }

    @GetMapping("/important")
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getImportantAnnouncements() {
        List<AnnouncementResponse> announcements = announcementService.getImportantAnnouncements();
        return ResponseEntity.ok(ApiResponse.success(announcements));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getAnnouncementById(@PathVariable Long id) {
        AnnouncementResponse announcement = announcementService.getAnnouncementById(id);
        if (!announcement.getIsPublic()) {
            return ResponseEntity.status(403).body(ApiResponse.error("This announcement is not public"));
        }
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }
}
