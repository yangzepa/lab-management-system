package com.lab.management.service;

import com.lab.management.dto.mapper.ResearcherMapper;
import com.lab.management.dto.request.ResearcherRequest;
import com.lab.management.dto.response.ResearcherResponse;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.ResearcherStatus;
import com.lab.management.entity.User;
import com.lab.management.exception.ResourceAlreadyExistsException;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResearcherService {

    private final ResearcherRepository researcherRepository;
    private final ResearcherMapper researcherMapper;
    private final UserRepository userRepository;

    public List<ResearcherResponse> getAllResearchers() {
        List<Researcher> researchers = researcherRepository.findAll();
        return researchers.stream()
                .map(this::enrichWithUserInfo)
                .toList();
    }

    public List<ResearcherResponse> getActiveResearchers() {
        List<Researcher> researchers = researcherRepository.findByStatus(ResearcherStatus.ACTIVE);
        return researchers.stream()
                .filter(r -> !r.getStudentId().startsWith("ADMIN")) // Exclude admin system accounts
                .map(this::enrichWithUserInfo)
                .toList();
    }

    public ResearcherResponse getResearcherById(Long id) {
        Researcher researcher = researcherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", id));
        return enrichWithUserInfo(researcher);
    }

    public ResearcherResponse getResearcherByStudentId(String studentId) {
        Researcher researcher = researcherRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "studentId", studentId));
        return enrichWithUserInfo(researcher);
    }

    private ResearcherResponse enrichWithUserInfo(Researcher researcher) {
        ResearcherResponse response = researcherMapper.toResponse(researcher);

        Optional<User> user = userRepository.findByResearcherId(researcher.getId());
        if (user.isPresent()) {
            response.setUsername(user.get().getUsername());
            response.setHasAccount(true);
        } else {
            response.setUsername(null);
            response.setHasAccount(false);
        }

        return response;
    }

    @Transactional
    public ResearcherResponse createResearcher(ResearcherRequest request) {
        // Check if student ID already exists
        if (researcherRepository.existsByStudentId(request.getStudentId())) {
            throw new ResourceAlreadyExistsException("Researcher", "studentId", request.getStudentId());
        }

        // Check if email already exists
        if (researcherRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Researcher", "email", request.getEmail());
        }

        Researcher researcher = researcherMapper.toEntity(request);
        if (researcher.getStatus() == null) {
            researcher.setStatus(ResearcherStatus.ACTIVE);
        }

        Researcher savedResearcher = researcherRepository.save(researcher);
        return enrichWithUserInfo(savedResearcher);
    }

    @Transactional
    public ResearcherResponse updateResearcher(Long id, ResearcherRequest request) {
        Researcher researcher = researcherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", id));

        // Check if student ID is being changed and if it already exists
        if (!researcher.getStudentId().equals(request.getStudentId()) &&
                researcherRepository.existsByStudentId(request.getStudentId())) {
            throw new ResourceAlreadyExistsException("Researcher", "studentId", request.getStudentId());
        }

        // Check if email is being changed and if it already exists
        if (!researcher.getEmail().equals(request.getEmail()) &&
                researcherRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Researcher", "email", request.getEmail());
        }

        researcherMapper.updateEntityFromRequest(request, researcher);
        Researcher updatedResearcher = researcherRepository.save(researcher);
        return enrichWithUserInfo(updatedResearcher);
    }

    @Transactional
    public void deleteResearcher(Long id) {
        Researcher researcher = researcherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Researcher", "id", id));
        researcherRepository.delete(researcher);
    }

    public long countByStatus(ResearcherStatus status) {
        return researcherRepository.countByStatus(status);
    }
}
