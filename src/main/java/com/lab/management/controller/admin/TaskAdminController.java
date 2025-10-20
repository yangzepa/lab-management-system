package com.lab.management.controller.admin;

import com.lab.management.dto.request.TaskRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.TaskResponse;
import com.lab.management.entity.TaskStatus;
import com.lab.management.service.TaskService;
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
@RequestMapping("/admin/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Admin - Tasks", description = "Admin endpoints for task management")
public class TaskAdminController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long researcherId) {
        List<TaskResponse> tasks;

        if (projectId != null) {
            tasks = taskService.getTasksByProjectId(projectId);
        } else if (researcherId != null) {
            tasks = taskService.getTasksByResearcherId(researcherId);
        } else if (status != null) {
            tasks = taskService.getTasksByStatus(status);
        } else {
            tasks = taskService.getAllTasks();
        }

        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PostMapping
    @Operation(summary = "Create new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
