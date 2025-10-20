package com.lab.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Long totalResearchers;
    private Long activeResearchers;
    private Long totalProjects;
    private Long activeProjects;
    private Long totalTasks;
    private Long completedTasks;
    private Map<String, Long> projectsByStatus;
    private Map<String, Long> tasksByStatus;
}
