package com.lab.management.controller.admin;

import com.lab.management.dto.request.ResearcherRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.service.ResearcherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/researchers")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin - Researchers", description = "Admin endpoints for researcher management")
public class ResearcherAdminController {

    private final ResearcherService researcherService;

    @GetMapping
    @Operation(summary = "Get all researchers")
    public ResponseEntity<ApiResponse<List<ResearcherResponse>>> getAllResearchers() {
        List<ResearcherResponse> researchers = researcherService.getAllResearchers();
        return ResponseEntity.ok(ApiResponse.success(researchers));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get researcher by ID")
    public ResponseEntity<ApiResponse<ResearcherResponse>> getResearcherById(@PathVariable Long id) {
        ResearcherResponse researcher = researcherService.getResearcherById(id);
        return ResponseEntity.ok(ApiResponse.success(researcher));
    }

    @PostMapping
    @Operation(summary = "Create new researcher")
    public ResponseEntity<ApiResponse<ResearcherResponse>> createResearcher(
            @Valid @RequestBody ResearcherRequest request) {
        ResearcherResponse researcher = researcherService.createResearcher(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Researcher created successfully", researcher));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update researcher")
    public ResponseEntity<ApiResponse<ResearcherResponse>> updateResearcher(
            @PathVariable Long id,
            @Valid @RequestBody ResearcherRequest request) {
        ResearcherResponse researcher = researcherService.updateResearcher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Researcher updated successfully", researcher));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete researcher")
    public ResponseEntity<ApiResponse<Void>> deleteResearcher(@PathVariable Long id) {
        researcherService.deleteResearcher(id);
        return ResponseEntity.ok(ApiResponse.success("Researcher deleted successfully", null));
    }
}
