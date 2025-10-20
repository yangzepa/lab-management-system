package com.lab.management.service;

import com.lab.management.dto.SeminarRequest;
import com.lab.management.dto.SeminarResponse;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.Seminar;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.SeminarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeminarService {

    private final SeminarRepository seminarRepository;
    private final ResearcherRepository researcherRepository;

    public List<SeminarResponse> getAllSeminars() {
        return seminarRepository.findAllByOrderBySeminarDateDesc().stream()
                .map(SeminarResponse::from)
                .collect(Collectors.toList());
    }

    public List<SeminarResponse> getPublicSeminars() {
        return seminarRepository.findByIsPublicTrueOrderBySeminarDateDesc().stream()
                .map(SeminarResponse::from)
                .collect(Collectors.toList());
    }

    public SeminarResponse getSeminarById(Long id) {
        Seminar seminar = seminarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seminar not found with id: " + id));
        return SeminarResponse.from(seminar);
    }

    public List<SeminarResponse> getSeminarsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return seminarRepository.findBySeminarDateBetween(startDate, endDate).stream()
                .map(SeminarResponse::from)
                .collect(Collectors.toList());
    }

    public List<SeminarResponse> getSeminarsByTopic(String topic) {
        return seminarRepository.findByTopicOrderBySeminarDateDesc(topic).stream()
                .map(SeminarResponse::from)
                .collect(Collectors.toList());
    }

    public List<SeminarResponse> getSeminarsByPresenter(Long presenterId) {
        return seminarRepository.findByPresenterIdOrderBySeminarDateDesc(presenterId).stream()
                .map(SeminarResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SeminarResponse createSeminar(SeminarRequest request) {
        Researcher presenter = null;
        if (request.getPresenterId() != null) {
            presenter = researcherRepository.findById(request.getPresenterId())
                    .orElseThrow(() -> new RuntimeException("Presenter not found with id: " + request.getPresenterId()));
        }

        Seminar seminar = Seminar.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .presenter(presenter)
                .seminarDate(request.getSeminarDate())
                .location(request.getLocation())
                .topic(request.getTopic())
                .isPublic(request.getIsPublic())
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        Seminar saved = seminarRepository.save(seminar);
        return SeminarResponse.from(saved);
    }

    @Transactional
    public SeminarResponse updateSeminar(Long id, SeminarRequest request) {
        Seminar seminar = seminarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seminar not found with id: " + id));

        if (request.getPresenterId() != null) {
            Researcher presenter = researcherRepository.findById(request.getPresenterId())
                    .orElseThrow(() -> new RuntimeException("Presenter not found with id: " + request.getPresenterId()));
            seminar.setPresenter(presenter);
        }

        seminar.setTitle(request.getTitle());
        seminar.setContent(request.getContent());
        seminar.setSeminarDate(request.getSeminarDate());
        seminar.setLocation(request.getLocation());
        seminar.setTopic(request.getTopic());
        seminar.setIsPublic(request.getIsPublic());
        seminar.setAttachmentUrl(request.getAttachmentUrl());

        return SeminarResponse.from(seminar);
    }

    @Transactional
    public void deleteSeminar(Long id) {
        if (!seminarRepository.existsById(id)) {
            throw new RuntimeException("Seminar not found with id: " + id);
        }
        seminarRepository.deleteById(id);
    }
}
