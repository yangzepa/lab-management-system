package com.lab.management.dto.mapper;

import com.lab.management.dto.request.TaskRequest;
import com.lab.management.dto.response.TaskResponse;
import com.lab.management.entity.Task;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ResearcherMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {

    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "projectName", source = "project.name")
    TaskResponse toResponse(Task task);

    List<TaskResponse> toResponseList(List<Task> tasks);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignees", ignore = true)
    Task toEntity(TaskRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "assignees", ignore = true)
    void updateEntityFromRequest(TaskRequest request, @MappingTarget Task task);
}
