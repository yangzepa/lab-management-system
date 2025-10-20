package com.lab.management.controller.admin;

import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.SeminarRequest;
import com.lab.management.dto.SeminarResponse;
import com.lab.management.service.SeminarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/seminars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SeminarAdminController {

    private final SeminarService seminarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getAllSeminars() {
        List<SeminarResponse> seminars = seminarService.getAllSeminars();
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeminarResponse>> getSeminarById(@PathVariable Long id) {
        SeminarResponse seminar = seminarService.getSeminarById(id);
        return ResponseEntity.ok(ApiResponse.success(seminar));
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getSeminarsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<SeminarResponse> seminars = seminarService.getSeminarsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @GetMapping("/by-topic")
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getSeminarsByTopic(@RequestParam String topic) {
        List<SeminarResponse> seminars = seminarService.getSeminarsByTopic(topic);
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @GetMapping("/by-presenter/{presenterId}")
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getSeminarsByPresenter(@PathVariable Long presenterId) {
        List<SeminarResponse> seminars = seminarService.getSeminarsByPresenter(presenterId);
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SeminarResponse>> createSeminar(@RequestBody SeminarRequest request) {
        SeminarResponse seminar = seminarService.createSeminar(request);
        return ResponseEntity.ok(ApiResponse.success(seminar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SeminarResponse>> updateSeminar(
            @PathVariable Long id,
            @RequestBody SeminarRequest request) {
        SeminarResponse seminar = seminarService.updateSeminar(id, request);
        return ResponseEntity.ok(ApiResponse.success(seminar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeminar(@PathVariable Long id) {
        seminarService.deleteSeminar(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
