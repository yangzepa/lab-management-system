package com.lab.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsernameChangeRequest {

    @NotBlank(message = "New username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String newUsername;
}
