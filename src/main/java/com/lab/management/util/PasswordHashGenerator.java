package com.lab.management.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Utility class to generate BCrypt password hashes
 * Run this class to generate hashes for data.sql
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        // Test existing hash
        String existingHash = "$2a$10$xQfLnHvKUd4YVvZnb8EKXe5v.MV7YpP8rrOu8cHN5fFPXKXV1tYqy";

        System.out.println("=== Testing Existing Hash ===");
        System.out.println("Testing password: 'admin123!'");
        System.out.println("Match result: " + encoder.matches("admin123!", existingHash));
        System.out.println();

        System.out.println("Testing password: 'password123!'");
        System.out.println("Match result: " + encoder.matches("password123!", existingHash));
        System.out.println();

        System.out.println("Testing password: 'password'");
        System.out.println("Match result: " + encoder.matches("password", existingHash));
        System.out.println();

        // Generate new hashes
        System.out.println("=== Generating New BCrypt Hashes ===");
        String admin123Hash = encoder.encode("admin123!");
        String password123Hash = encoder.encode("password123!");

        System.out.println("Password: 'admin123!'");
        System.out.println("Hash: " + admin123Hash);
        System.out.println();

        System.out.println("Password: 'password123!'");
        System.out.println("Hash: " + password123Hash);
        System.out.println();

        // Verify new hashes
        System.out.println("=== Verification ===");
        System.out.println("admin123! verification: " + encoder.matches("admin123!", admin123Hash));
        System.out.println("password123! verification: " + encoder.matches("password123!", password123Hash));
    }
}
