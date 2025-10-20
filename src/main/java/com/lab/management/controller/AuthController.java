package com.lab.management.controller;

import com.lab.management.dto.request.LoginRequest;
import com.lab.management.dto.request.RegisterRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.dto.response.JwtResponse;
import com.lab.management.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register new user account")
    public ResponseEntity<ApiResponse<JwtResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        JwtResponse jwtResponse = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", jwtResponse));
    }
}
