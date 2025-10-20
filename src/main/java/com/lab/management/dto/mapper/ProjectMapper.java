package com.lab.management.dto.mapper;

import com.lab.management.dto.request.ProjectRequest;
import com.lab.management.dto.response.ProjectResponse;
import com.lab.management.entity.Project;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ResearcherMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {

    @Mapping(target = "taskCount", expression = "java(project.getTasks() != null ? project.getTasks().size() : 0)")
    ProjectResponse toResponse(Project project);

    List<ProjectResponse> toResponseList(List<Project> projects);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "researchers", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Project toEntity(ProjectRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "researchers", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    void updateEntityFromRequest(ProjectRequest request, @MappingTarget Project project);
}
