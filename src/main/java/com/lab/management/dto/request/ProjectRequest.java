package com.lab.management.dto.request;

import com.lab.management.entity.Priority;
import com.lab.management.entity.ProjectStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private ProjectStatus status;

    private Priority priority;

    @Min(value = 0, message = "Progress must be between 0 and 100")
    @Max(value = 100, message = "Progress must be between 0 and 100")
    private Integer progress;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private Long budget;

    private Boolean isPublic;

    private List<String> categories;

    private List<Long> researcherIds;
}
