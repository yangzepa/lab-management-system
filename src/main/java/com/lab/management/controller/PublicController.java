package com.lab.management.controller;

import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.LabInfoResponse;
import com.lab.management.dto.response.ProjectResponse;
import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.entity.ResearchArea;
import com.lab.management.service.LabInfoService;
import com.lab.management.service.ProjectService;
import com.lab.management.service.ResearchAreaService;
import com.lab.management.service.ResearcherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Tag(name = "Public", description = "Public endpoints (no authentication required)")
public class PublicController {

    private final ResearcherService researcherService;
    private final ProjectService projectService;
    private final LabInfoService labInfoService;
    private final ResearchAreaService researchAreaService;

    @GetMapping("/lab/info")
    @Operation(summary = "Get lab information")
    public ResponseEntity<ApiResponse<LabInfoResponse>> getLabInfo() {
        LabInfoResponse labInfo = labInfoService.getLabInfo();
        return ResponseEntity.ok(ApiResponse.success(labInfo));
    }

    @GetMapping("/researchers")
    @Operation(summary = "Get all active researchers", description = "Returns list of active researchers without sensitive data")
    public ResponseEntity<ApiResponse<List<ResearcherResponse>>> getActiveResearchers() {
        List<ResearcherResponse> researchers = researcherService.getActiveResearchers();
        return ResponseEntity.ok(ApiResponse.success(researchers));
    }

    @GetMapping("/projects")
    @Operation(summary = "Get all active projects", description = "Returns list of non-confidential active projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getActiveProjects() {
        List<ProjectResponse> projects = projectService.getActiveProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/research-areas")
    @Operation(summary = "Get available research areas")
    public ResponseEntity<ApiResponse<List<String>>> getResearchAreas() {
        List<String> researchAreas = researchAreaService.getAllResearchAreas()
                .stream()
                .map(ResearchArea::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(researchAreas));
    }
}
