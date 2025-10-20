package com.lab.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabInfoResponse {
    private Long id;
    private String name;
    private String university;
    private String department;
    private String professor;
    private String email;
    private String website;
    private String phone;
    private String introduction;
    private String researchFocus;
    private String address;
    private String logoUrl;
}
