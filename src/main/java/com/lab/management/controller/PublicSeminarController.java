package com.lab.management.controller;

import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.SeminarResponse;
import com.lab.management.service.SeminarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/public/seminars")
@RequiredArgsConstructor
public class PublicSeminarController {

    private final SeminarService seminarService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getPublicSeminars() {
        List<SeminarResponse> seminars = seminarService.getPublicSeminars();
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeminarResponse>> getSeminarById(@PathVariable Long id) {
        SeminarResponse seminar = seminarService.getSeminarById(id);
        if (!seminar.getIsPublic()) {
            return ResponseEntity.status(403).body(ApiResponse.error("This seminar is not public"));
        }
        return ResponseEntity.ok(ApiResponse.success(seminar));
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<ApiResponse<List<SeminarResponse>>> getSeminarsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<SeminarResponse> seminars = seminarService.getSeminarsByDateRange(startDate, endDate);
        // Filter only public seminars
        seminars = seminars.stream().filter(SeminarResponse::getIsPublic).toList();
        return ResponseEntity.ok(ApiResponse.success(seminars));
    }
}
