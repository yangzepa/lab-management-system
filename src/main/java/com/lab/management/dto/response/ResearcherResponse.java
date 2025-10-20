package com.lab.management.dto.response;

import com.lab.management.entity.Grade;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.ResearcherStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearcherResponse {

    private Long id;
    private String name;
    private String studentId;
    private Grade grade;
    private Integer admissionYear;
    private String email;
    private String phone;
    private ResearcherStatus status;
    private LocalDate joinDate;
    private List<String> researchAreas;
    private String photoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Account information
    private String username;
    private Boolean hasAccount;

    public static ResearcherResponse from(Researcher researcher) {
        return ResearcherResponse.builder()
                .id(researcher.getId())
                .name(researcher.getName())
                .studentId(researcher.getStudentId())
                .grade(researcher.getGrade())
                .admissionYear(researcher.getAdmissionYear())
                .email(researcher.getEmail())
                .phone(researcher.getPhone())
                .status(researcher.getStatus())
                .joinDate(researcher.getJoinDate())
                .researchAreas(researcher.getResearchAreas())
                .photoUrl(researcher.getPhotoUrl())
                .createdAt(researcher.getCreatedAt())
                .updatedAt(researcher.getUpdatedAt())
                .build();
    }
}
