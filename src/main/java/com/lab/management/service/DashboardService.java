package com.lab.management.service;

import com.lab.management.dto.response.DashboardResponse;
import com.lab.management.entity.ProjectStatus;
import com.lab.management.entity.ResearcherStatus;
import com.lab.management.entity.TaskStatus;
import com.lab.management.repository.ProjectRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ResearcherRepository researcherRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardResponse getDashboardStatistics() {
        // Researcher statistics
        long totalResearchers = researcherRepository.count();
        long activeResearchers = researcherRepository.countByStatus(ResearcherStatus.ACTIVE);

        // Project statistics
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);

        // Task statistics
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(TaskStatus.DONE);

        // Projects by status
        Map<String, Long> projectsByStatus = new HashMap<>();
        for (ProjectStatus status : ProjectStatus.values()) {
            projectsByStatus.put(status.name(), projectRepository.countByStatus(status));
        }

        // Tasks by status
        Map<String, Long> tasksByStatus = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            tasksByStatus.put(status.name(), taskRepository.countByStatus(status));
        }

        return DashboardResponse.builder()
                .totalResearchers(totalResearchers)
                .activeResearchers(activeResearchers)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .projectsByStatus(projectsByStatus)
                .tasksByStatus(tasksByStatus)
                .build();
    }
}
