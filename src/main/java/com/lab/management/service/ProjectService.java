package com.lab.management.service;

import com.lab.management.dto.mapper.ProjectMapper;
import com.lab.management.dto.request.ProjectRequest;
import com.lab.management.dto.response.ProjectResponse;
import com.lab.management.entity.Project;
import com.lab.management.entity.ProjectStatus;
import com.lab.management.entity.Researcher;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.ProjectRepository;
import com.lab.management.repository.ProjectHistoryRepository;
import com.lab.management.repository.ResearcherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ResearcherRepository researcherRepository;
    private final ProjectMapper projectMapper;
    private final ProjectHistoryService projectHistoryService;
    private final ProjectHistoryRepository projectHistoryRepository;

    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projectMapper.toResponseList(projects);
    }

    public List<ProjectResponse> getActiveProjects() {
        List<Project> projects = projectRepository.findAllActiveProjects();
        return projectMapper.toResponseList(projects);
    }

    public List<ProjectResponse> getProjectsByStatus(ProjectStatus status) {
        List<Project> projects = projectRepository.findByStatus(status);
        return projectMapper.toResponseList(projects);
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return projectMapper.toResponse(project);
    }

    public List<ProjectResponse> getProjectsByResearcherId(Long researcherId) {
        List<Project> projects = projectRepository.findByResearcherId(researcherId);
        return projectMapper.toResponseList(projects);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = projectMapper.toEntity(request);

        // Set default values if not provided
        if (project.getStatus() == null) {
            project.setStatus(ProjectStatus.PLANNING);
        }
        if (project.getProgress() == null) {
            project.setProgress(0);
        }

        // Associate researchers if provided
        if (request.getResearcherIds() != null && !request.getResearcherIds().isEmpty()) {
            List<Researcher> researchers = researcherRepository.findAllById(request.getResearcherIds());
            project.setResearchers(researchers);
        }

        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        projectMapper.updateEntityFromRequest(request, project);

        // Update researchers if provided
        if (request.getResearcherIds() != null) {
            List<Researcher> researchers = researcherRepository.findAllById(request.getResearcherIds());
            project.setResearchers(researchers);
        }

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        // Delete project history first to avoid foreign key constraint violation
        projectHistoryRepository.deleteByProjectId(id);

        projectRepository.delete(project);
    }

    @Transactional
    public void deleteProjectWithHistory(Long id, Researcher researcher) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        String projectName = project.getName();

        // Log history before deletion
        projectHistoryService.logHistory(project, researcher, "PROJECT_DELETED",
                String.format("프로젝트 '%s' 삭제", projectName));

        // Delete all project history including the deletion log
        projectHistoryRepository.deleteByProjectId(id);

        // Delete the project
        projectRepository.delete(project);
    }

    public long countByStatus(ProjectStatus status) {
        return projectRepository.countByStatus(status);
    }

    @Transactional
    public ProjectResponse updateProjectWithHistory(Long id, ProjectRequest request, Researcher researcher) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        // Track changes
        StringBuilder changes = new StringBuilder();
        if (!project.getName().equals(request.getName())) {
            changes.append(String.format("프로젝트명 변경: %s → %s; ", project.getName(), request.getName()));
        }
        if (request.getProgress() != null && !project.getProgress().equals(request.getProgress())) {
            changes.append(String.format("진행률 변경: %d%% → %d%%; ", project.getProgress(), request.getProgress()));
        }
        if (request.getStatus() != null && !project.getStatus().equals(request.getStatus())) {
            changes.append(String.format("상태 변경: %s → %s; ", project.getStatus(), request.getStatus()));
        }

        projectMapper.updateEntityFromRequest(request, project);

        // Update researchers if provided
        if (request.getResearcherIds() != null) {
            List<Researcher> researchers = researcherRepository.findAllById(request.getResearcherIds());
            project.setResearchers(researchers);
        }

        Project updatedProject = projectRepository.save(project);

        // Log history
        if (changes.length() > 0) {
            projectHistoryService.logHistory(project, researcher, "UPDATED", changes.toString());
        }

        return projectMapper.toResponse(updatedProject);
    }
}
