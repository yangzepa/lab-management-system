package com.lab.management.dto.mapper;

import com.lab.management.dto.request.ResearcherRequest;
import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.entity.Researcher;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ResearcherMapper {

    ResearcherResponse toResponse(Researcher researcher);

    List<ResearcherResponse> toResponseList(List<Researcher> researchers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projects", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "user", ignore = true)
    Researcher toEntity(ResearcherRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "projects", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromRequest(ResearcherRequest request, @MappingTarget Researcher researcher);
}
