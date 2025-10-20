package com.lab.management.dto.response;

import com.lab.management.entity.Priority;
import com.lab.management.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String name;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private Integer estimatedHours;
    private Long projectId;
    private String projectName;
    private List<ResearcherResponse> assignees;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
