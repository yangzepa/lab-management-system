package com.lab.management.dto.response;

import com.lab.management.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private Role role;
    private Long researcherId;
    private String researcherName;
    private Boolean enabled;
}
