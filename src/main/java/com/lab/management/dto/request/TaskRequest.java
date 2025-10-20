package com.lab.management.dto.request;

import com.lab.management.entity.Priority;
import com.lab.management.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task name is required")
    private String name;

    private String description;

    private TaskStatus status;

    private Priority priority;

    private LocalDate dueDate;

    private Integer estimatedHours;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private List<Long> assigneeIds;
}
