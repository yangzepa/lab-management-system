package com.lab.management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabInfoRequest {

    @NotBlank(message = "Lab name is required")
    private String name;

    @NotBlank(message = "University is required")
    private String university;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Professor name is required")
    private String professor;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String website;
    private String phone;
    private String introduction;
    private String researchFocus;
    private String address;
    private String logoUrl;
}
