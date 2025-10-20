package com.lab.management.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderTest {

    @Test
    public void generatePasswords() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String admin123Hash = encoder.encode("admin123!");
        String password123Hash = encoder.encode("password123!");

        System.out.println("=== Generated BCrypt Hashes ===");
        System.out.println("admin123! -> " + admin123Hash);
        System.out.println("password123! -> " + password123Hash);
        System.out.println();

        // Verify the hashes work
        System.out.println("=== Verification ===");
        System.out.println("admin123! matches: " + encoder.matches("admin123!", admin123Hash));
        System.out.println("password123! matches: " + encoder.matches("password123!", password123Hash));
    }

    @Test
    public void verifyExistingHash() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String existingHash = "$2a$10$xQfLnHvKUd4YVvZnb8EKXe5v.MV7YpP8rrOu8cHN5fFPXKXV1tYqy";

        System.out.println("=== Testing Existing Hash ===");
        System.out.println("admin123! matches: " + encoder.matches("admin123!", existingHash));
        System.out.println("password123! matches: " + encoder.matches("password123!", existingHash));
        System.out.println("admin matches: " + encoder.matches("admin", existingHash));
        System.out.println("password matches: " + encoder.matches("password", existingHash));
    }
}
