package com.lab.management.dto.request;

import com.lab.management.entity.Grade;
import com.lab.management.entity.ResearcherStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearcherRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Grade is required")
    private Grade grade;

    private Integer admissionYear;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private ResearcherStatus status;

    @NotNull(message = "Join date is required")
    private LocalDate joinDate;

    private List<String> researchAreas;

    private String photoUrl;
}
