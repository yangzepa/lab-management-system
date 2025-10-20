package com.lab.management.controller.admin;

import com.lab.management.dto.AnnouncementRequest;
import com.lab.management.dto.AnnouncementResponse;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/announcements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnnouncementAdminController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementResponse>>> getAllAnnouncements() {
        List<AnnouncementResponse> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(ApiResponse.success(announcements));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getAnnouncementById(@PathVariable Long id) {
        AnnouncementResponse announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AnnouncementResponse>> createAnnouncement(@RequestBody AnnouncementRequest request) {
        AnnouncementResponse announcement = announcementService.createAnnouncement(request);
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementRequest request) {
        AnnouncementResponse announcement = announcementService.updateAnnouncement(id, request);
        return ResponseEntity.ok(ApiResponse.success(announcement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
