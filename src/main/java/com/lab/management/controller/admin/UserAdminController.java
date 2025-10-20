package com.lab.management.controller.admin;

import com.lab.management.dto.request.PasswordChangeRequest;
import com.lab.management.dto.request.UserAccountRequest;
import com.lab.management.dto.response.ApiResponse;
import com.lab.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/researchers/{researcherId}/account")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createAccount(
            @PathVariable Long researcherId,
            @RequestBody UserAccountRequest request) {
        userService.createUserAccount(researcherId, request);
        return ResponseEntity.ok(ApiResponse.success("User account created successfully", null));
    }

    @PutMapping("/username")
    public ResponseEntity<ApiResponse<Void>> updateUsername(
            @PathVariable Long researcherId,
            @RequestBody UserAccountRequest request) {
        userService.updateUsername(researcherId, request.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Username updated successfully", null));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable Long researcherId,
            @RequestBody PasswordChangeRequest request) {
        userService.changePassword(researcherId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long researcherId) {
        userService.deleteUserAccount(researcherId);
        return ResponseEntity.ok(ApiResponse.success("User account deleted successfully", null));
    }
}
