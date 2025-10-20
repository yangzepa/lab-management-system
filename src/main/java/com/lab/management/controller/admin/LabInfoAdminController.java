package com.lab.management.controller.admin;

import com.lab.management.dto.request.LabInfoRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.LabInfoResponse;
import com.lab.management.service.LabInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/lab-info")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Lab Info", description = "Lab information management (Admin only)")
@SecurityRequirement(name = "bearerAuth")
public class LabInfoAdminController {

    private final LabInfoService labInfoService;

    @GetMapping
    @Operation(summary = "Get lab information")
    public ResponseEntity<ApiResponse<LabInfoResponse>> getLabInfo() {
        LabInfoResponse labInfo = labInfoService.getLabInfo();
        return ResponseEntity.ok(ApiResponse.success(labInfo));
    }

    @PutMapping
    @Operation(summary = "Update lab information")
    public ResponseEntity<ApiResponse<LabInfoResponse>> updateLabInfo(
            @Valid @RequestBody LabInfoRequest request) {
        LabInfoResponse labInfo = labInfoService.updateLabInfo(request);
        return ResponseEntity.ok(ApiResponse.success(labInfo));
    }
}
