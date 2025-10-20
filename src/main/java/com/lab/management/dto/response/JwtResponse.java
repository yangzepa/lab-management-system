package com.lab.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private String username;
    private String role;
    private Long researcherId;

    public JwtResponse(String token, String username, String role, Long researcherId) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.researcherId = researcherId;
    }
}
