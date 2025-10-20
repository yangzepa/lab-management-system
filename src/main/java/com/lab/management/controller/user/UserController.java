package com.lab.management.controller.user;

import com.lab.management.dto.request.CommentRequest;
import com.lab.management.dto.request.PasswordChangeRequest;
import com.lab.management.dto.request.ProjectRequest;
import com.lab.management.dto.request.ResearcherRequest;
import com.lab.management.dto.request.TaskRequest;
import com.lab.management.dto.request.UsernameChangeRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.CommentResponse;
import com.lab.management.dto.response.ProjectHistoryResponse;
import com.lab.management.dto.response.ProjectResponse;
import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.dto.response.TaskResponse;
import com.lab.management.entity.ResearchArea;
import com.lab.management.entity.User;
import com.lab.management.repository.UserRepository;
import com.lab.management.service.CommentService;
import com.lab.management.service.ProjectHistoryService;
import com.lab.management.service.ProjectService;
import com.lab.management.service.ResearchAreaService;
import com.lab.management.service.ResearcherService;
import com.lab.management.service.TaskService;
import com.lab.management.service.UserService;
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
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "User", description = "User endpoints for researchers")
public class UserController {

    private final ResearcherService researcherService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserRepository userRepository;
    private final ResearchAreaService researchAreaService;
    private final CommentService commentService;
    private final ProjectHistoryService projectHistoryService;
    private final UserService userService;

    @GetMapping("/my-profile")
    @Operation(summary = "Get my profile")
    public ResponseEntity<ApiResponse<ResearcherResponse>> getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        ResearcherResponse researcher = researcherService.getResearcherById(user.getResearcher().getId());
        return ResponseEntity.ok(ApiResponse.success(researcher));
    }

    @PutMapping("/my-profile")
    @Operation(summary = "Update my profile")
    public ResponseEntity<ApiResponse<ResearcherResponse>> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody ResearcherRequest request) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        ResearcherResponse researcher = researcherService.updateResearcher(user.getResearcher().getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", researcher));
    }

    @GetMapping("/my-tasks")
    @Operation(summary = "Get my assigned tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        List<TaskResponse> tasks = taskService.getTasksByResearcherId(user.getResearcher().getId());
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/my-projects")
    @Operation(summary = "Get my projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        List<ProjectResponse> projects = projectService.getProjectsByResearcherId(user.getResearcher().getId());
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/projects")
    @Operation(summary = "Get all projects (read-only for researchers)")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/projects/{id}")
    @Operation(summary = "Get project by ID (read-only for researchers)")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping("/tasks/{taskId}/request-join")
    @Operation(summary = "Request to join a task")
    public ResponseEntity<ApiResponse<TaskResponse>> requestJoinTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        TaskResponse task = taskService.requestJoinTask(taskId, user.getResearcher().getId());
        return ResponseEntity.ok(ApiResponse.success("Successfully requested to join task", task));
    }

    @PostMapping("/projects")
    @Operation(summary = "Create new project (available to all logged-in users)")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        ProjectResponse project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }

    @GetMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Get all tasks for a specific project (read-only for researchers)")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getProjectTasks(@PathVariable Long projectId) {
        List<TaskResponse> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PutMapping("/tasks/{taskId}")
    @Operation(summary = "Update my assigned task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateMyTask(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> updates,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        // Check if task is assigned to this researcher
        TaskResponse task = taskService.getTaskById(taskId);
        boolean isAssigned = task.getAssignees().stream()
                .anyMatch(assignee -> assignee.getId().equals(user.getResearcher().getId()));

        if (!isAssigned) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You are not assigned to this task"));
        }

        // Only allow updating status
        if (updates.containsKey("status")) {
            com.lab.management.dto.request.TaskRequest updateRequest = new com.lab.management.dto.request.TaskRequest();
            updateRequest.setStatus(com.lab.management.entity.TaskStatus.valueOf(updates.get("status").toString()));
            TaskResponse updatedTask = taskService.updateTask(taskId, updateRequest);
            return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updatedTask));
        }

        return ResponseEntity.ok(ApiResponse.error("No valid updates provided"));
    }

    @PostMapping("/research-areas")
    @Operation(summary = "Create a new research area (available to all users)")
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

    @GetMapping("/tasks/{taskId}/comments")
    @Operation(summary = "Get all comments for a task")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getTaskComments(@PathVariable Long taskId) {
        List<CommentResponse> comments = commentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @PostMapping("/tasks/{taskId}/comments")
    @Operation(summary = "Create a comment on a task")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        CommentResponse comment = commentService.createComment(taskId, user.getResearcher().getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment created successfully", comment));
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "Update my comment")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        try {
            CommentResponse comment = commentService.updateComment(commentId, user.getResearcher().getId(), request);
            return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", comment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete my comment")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        try {
            commentService.deleteComment(commentId, user.getResearcher().getId(), false);
            return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "Update project (available to all logged-in users)")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        ProjectResponse project = projectService.updateProjectWithHistory(id, request, user.getResearcher());
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @PostMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Create task in project (available to all logged-in users)")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        request.setProjectId(projectId);
        TaskResponse task = taskService.createTaskWithHistory(request, user.getResearcher());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    @Operation(summary = "Update task (available to all logged-in users)")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        TaskResponse task = taskService.updateTaskWithHistory(taskId, request, user.getResearcher());
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @GetMapping("/projects/{projectId}/history")
    @Operation(summary = "Get project history")
    public ResponseEntity<ApiResponse<List<ProjectHistoryResponse>>> getProjectHistory(@PathVariable Long projectId) {
        List<ProjectHistoryResponse> history = projectHistoryService.getProjectHistory(projectId, 15);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    @Operation(summary = "Delete task (available to all logged-in users)")
    public ResponseEntity<ApiResponse<String>> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getResearcher() == null) {
            return ResponseEntity.ok(ApiResponse.error("No researcher profile associated with this user"));
        }

        try {
            taskService.deleteTaskWithHistory(taskId, user.getResearcher());
            return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/account/username")
    @Operation(summary = "Update my username")
    public ResponseEntity<ApiResponse<String>> updateMyUsername(
            @Valid @RequestBody UsernameChangeRequest request,
            Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            userService.updateMyUsername(currentUsername, request.getNewUsername());
            return ResponseEntity.ok(ApiResponse.success("Username updated successfully. Please login again with your new username.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/account/password")
    @Operation(summary = "Change my password")
    public ResponseEntity<ApiResponse<String>> changeMyPassword(
            @Valid @RequestBody PasswordChangeRequest request,
            Authentication authentication) {
        try {
            String currentUsername = authentication.getName();
            userService.changeMyPassword(currentUsername, request);
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
