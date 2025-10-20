package com.lab.management.controller.admin;

import com.lab.management.dto.request.ProjectRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.ProjectResponse;
import com.lab.management.entity.ProjectStatus;
import com.lab.management.entity.User;
import com.lab.management.repository.UserRepository;
import com.lab.management.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/projects")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin - Projects", description = "Admin endpoints for project management")
public class ProjectAdminController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(
            @RequestParam(required = false) ProjectStatus status) {
        List<ProjectResponse> projects = status != null
                ? projectService.getProjectsByStatus(status)
                : projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping
    @Operation(summary = "Create new project")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse project = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() != null) {
            // Admin with researcher profile - track deletion history
            projectService.deleteProjectWithHistory(id, user.getResearcher());
        } else {
            // Admin without researcher profile - delete without history
            projectService.deleteProject(id);
        }

        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
