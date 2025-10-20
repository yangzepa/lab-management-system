package com.lab.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectHistoryResponse {
    private Long id;
    private Long projectId;
    private String researcherName;
    private String researcherEmail;
    private String action;
    private String description;
    private LocalDateTime createdAt;
}
