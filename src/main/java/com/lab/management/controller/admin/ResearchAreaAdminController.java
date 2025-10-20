package com.lab.management.controller.admin;

import com.lab.management.dto.response.ApiResponse;
import com.lab.management.entity.ResearchArea;
import com.lab.management.service.ResearchAreaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/research-areas")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin - Research Areas", description = "Admin endpoints for managing research areas")
public class ResearchAreaAdminController {

    private final ResearchAreaService researchAreaService;

    @GetMapping
    @Operation(summary = "Get all research areas")
    public ResponseEntity<ApiResponse<List<ResearchArea>>> getAllResearchAreas() {
        List<ResearchArea> researchAreas = researchAreaService.getAllResearchAreas();
        return ResponseEntity.ok(ApiResponse.success(researchAreas));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get research area by ID")
    public ResponseEntity<ApiResponse<ResearchArea>> getResearchAreaById(@PathVariable Long id) {
        ResearchArea researchArea = researchAreaService.getResearchAreaById(id);
        return ResponseEntity.ok(ApiResponse.success(researchArea));
    }

    @PostMapping
    @Operation(summary = "Create new research area")
    public ResponseEntity<ApiResponse<ResearchArea>> createResearchArea(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String description = request.get("description");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Research area name is required"));
        }

        try {
            ResearchArea researchArea = researchAreaService.createResearchArea(name.trim(), description);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Research area created successfully", researchArea));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update research area")
    public ResponseEntity<ApiResponse<ResearchArea>> updateResearchArea(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String description = request.get("description");

        try {
            ResearchArea researchArea = researchAreaService.updateResearchArea(id, name, description);
            return ResponseEntity.ok(ApiResponse.success("Research area updated successfully", researchArea));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete research area")
    public ResponseEntity<ApiResponse<Void>> deleteResearchArea(@PathVariable Long id) {
        try {
            researchAreaService.deleteResearchArea(id);
            return ResponseEntity.ok(ApiResponse.success("Research area deleted successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
