package com.lab.management.service;

import com.lab.management.dto.response.ProjectHistoryResponse;
import com.lab.management.entity.Project;
import com.lab.management.entity.ProjectHistory;
import com.lab.management.entity.Researcher;
import com.lab.management.repository.ProjectHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectHistoryService {

    private final ProjectHistoryRepository projectHistoryRepository;

    @Transactional
    public void logHistory(Project project, Researcher researcher, String action, String description) {
        ProjectHistory history = ProjectHistory.builder()
                .project(project)
                .researcher(researcher)
                .action(action)
                .description(description)
                .build();
        projectHistoryRepository.save(history);
    }

    public List<ProjectHistoryResponse> getProjectHistory(Long projectId, int limit) {
        List<ProjectHistory> histories = projectHistoryRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId, PageRequest.of(0, limit));

        return histories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ProjectHistoryResponse toResponse(ProjectHistory history) {
        return ProjectHistoryResponse.builder()
                .id(history.getId())
                .projectId(history.getProject().getId())
                .researcherName(history.getResearcher().getName())
                .researcherEmail(history.getResearcher().getEmail())
                .action(history.getAction())
                .description(history.getDescription())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
