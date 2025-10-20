package com.lab.management.dto;

import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.entity.Seminar;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeminarResponse {
    private Long id;
    private String title;
    private String content;
    private ResearcherResponse presenter;
    private LocalDateTime seminarDate;
    private String location;
    private String topic;
    private Boolean isPublic;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SeminarResponse from(Seminar seminar) {
        return SeminarResponse.builder()
                .id(seminar.getId())
                .title(seminar.getTitle())
                .content(seminar.getContent())
                .presenter(seminar.getPresenter() != null ? ResearcherResponse.from(seminar.getPresenter()) : null)
                .seminarDate(seminar.getSeminarDate())
                .location(seminar.getLocation())
                .topic(seminar.getTopic())
                .isPublic(seminar.getIsPublic())
                .attachmentUrl(seminar.getAttachmentUrl())
                .createdAt(seminar.getCreatedAt())
                .updatedAt(seminar.getUpdatedAt())
                .build();
    }
}
