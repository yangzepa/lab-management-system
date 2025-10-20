package com.lab.management.service;

import com.lab.management.dto.request.PasswordChangeRequest;
import com.lab.management.dto.request.UserAccountRequest;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.Role;
import com.lab.management.entity.User;
import com.lab.management.exception.ResourceAlreadyExistsException;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final ResearcherRepository researcherRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUserAccount(Long researcherId, UserAccountRequest request) {
        // Check if researcher exists
        Researcher researcher = researcherRepository.findById(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", researcherId));

        // Check if researcher already has an account
        if (userRepository.findByResearcherId(researcherId).isPresent()) {
            throw new ResourceAlreadyExistsException("User account", "researcherId", researcherId);
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("User", "username", request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.RESEARCHER)
                .researcher(researcher)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public void updateUsername(Long researcherId, String newUsername) {
        User user = userRepository.findByResearcherId(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "researcherId", researcherId));

        // Check if new username already exists
        if (!user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new ResourceAlreadyExistsException("User", "username", newUsername);
        }

        user.setUsername(newUsername);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long researcherId, PasswordChangeRequest request) {
        User user = userRepository.findByResearcherId(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "researcherId", researcherId));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void updateMyUsername(String currentUsername, String newUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));

        // Check if new username already exists
        if (!user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new ResourceAlreadyExistsException("User", "username", newUsername);
        }

        user.setUsername(newUsername);
        userRepository.save(user);
    }

    @Transactional
    public void changeMyPassword(String currentUsername, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUserAccount(Long researcherId) {
        User user = userRepository.findByResearcherId(researcherId)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "researcherId", researcherId));

        userRepository.delete(user);
    }
}
