package com.lab.management.controller.admin;

import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.DashboardResponse;
import com.lab.management.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin - Dashboard", description = "Admin dashboard endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardStats() {
        DashboardResponse stats = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
