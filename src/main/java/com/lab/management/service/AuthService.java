package com.lab.management.service;

import com.lab.management.dto.request.LoginRequest;
import com.lab.management.dto.request.RegisterRequest;
import com.lab.management.dto.response.JwtResponse;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.Role;
import com.lab.management.entity.User;
import com.lab.management.exception.ResourceAlreadyExistsException;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import com.lab.management.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ResearcherRepository researcherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.replace("ROLE_", ""))  // Remove ROLE_ prefix
                .findFirst()
                .orElse("RESEARCHER");

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", userDetails.getUsername()));

        Long researcherId = user.getResearcher() != null ? user.getResearcher().getId() : null;

        return new JwtResponse(jwt, userDetails.getUsername(), role, researcherId);
    }

    @Transactional
    public JwtResponse register(RegisterRequest registerRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ResourceAlreadyExistsException("User", "username", registerRequest.getUsername());
        }

        // Create new user
        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.RESEARCHER)
                .enabled(true)
                .build();

        // Associate with researcher if researcherId is provided
        if (registerRequest.getResearcherId() != null) {
            Researcher researcher = researcherRepository.findById(registerRequest.getResearcherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", registerRequest.getResearcherId()));
            user.setResearcher(researcher);
        }

        User savedUser = userRepository.save(user);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword()));

        String jwt = jwtUtils.generateJwtToken(authentication);
        Long researcherId = savedUser.getResearcher() != null ? savedUser.getResearcher().getId() : null;

        return new JwtResponse(jwt, savedUser.getUsername(), savedUser.getRole().name(), researcherId);
    }
}
