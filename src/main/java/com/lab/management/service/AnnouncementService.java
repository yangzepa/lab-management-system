package com.lab.management.service;

import com.lab.management.dto.AnnouncementRequest;
import com.lab.management.dto.AnnouncementResponse;
import com.lab.management.entity.Announcement;
import com.lab.management.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<AnnouncementResponse> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AnnouncementResponse::from)
                .collect(Collectors.toList());
    }

    public List<AnnouncementResponse> getPublicAnnouncements() {
        return announcementRepository.findByIsPublicTrueOrderByCreatedAtDesc().stream()
                .map(AnnouncementResponse::from)
                .collect(Collectors.toList());
    }

    public List<AnnouncementResponse> getImportantAnnouncements() {
        return announcementRepository.findByIsImportantTrueAndIsPublicTrueOrderByCreatedAtDesc().stream()
                .map(AnnouncementResponse::from)
                .collect(Collectors.toList());
    }

    public AnnouncementResponse getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        return AnnouncementResponse.from(announcement);
    }

    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .isImportant(request.getIsImportant())
                .isPublic(request.getIsPublic())
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return AnnouncementResponse.from(saved);
    }

    @Transactional
    public AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setIsImportant(request.getIsImportant());
        announcement.setIsPublic(request.getIsPublic());

        return AnnouncementResponse.from(announcement);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found with id: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
