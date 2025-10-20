package com.lab.management.dto.response;

import com.lab.management.entity.Priority;
import com.lab.management.entity.ProjectStatus;
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
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private Priority priority;
    private Integer progress;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long budget;
    private Boolean isPublic;
    private List<String> categories;
    private List<ResearcherResponse> researchers;
    private Integer taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
