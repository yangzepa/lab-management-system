package com.lab.management.service;

import com.lab.management.dto.CreateNoticeRequest;
import com.lab.management.dto.NoticeDTO;
import com.lab.management.entity.Notice;
import com.lab.management.entity.Researcher;
import com.lab.management.entity.User;
import com.lab.management.exception.ResourceNotFoundException;
import com.lab.management.repository.NoticeRepository;
import com.lab.management.repository.ResearcherRepository;
import com.lab.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final ResearcherRepository researcherRepository;
    private final UserRepository userRepository;

    // 공개 공지 목록 조회 (최신 N개)
    @Transactional(readOnly = true)
    public List<NoticeDTO> getPublicNotices(int limit) {
        List<Notice> notices = noticeRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        return notices.stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 공개 공지 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getPublicNotices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notice> noticePage = noticeRepository.findByIsPublicTrueOrderByCreatedAtDesc(pageable);
        return noticePage.map(this::convertToDTO);
    }

    // 모든 공지 목록 조회 (페이징, 관리자용)
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getAllNotices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notice> noticePage = noticeRepository.findAllByOrderByCreatedAtDesc(pageable);
        return noticePage.map(this::convertToDTO);
    }

    // 공지 상세 조회
    @Transactional(readOnly = true)
    public NoticeDTO getNoticeById(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));
        return convertToDTO(notice);
    }

    // 공지 작성 (모든 멤버 가능)
    @Transactional
    public NoticeDTO createNotice(CreateNoticeRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher author = user.getResearcher();
        if (author == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setIsPublic(request.getIsPublic());
        notice.setImageUrl(request.getImageUrl());
        notice.setAttachmentUrl(request.getAttachmentUrl());
        notice.setAttachmentName(request.getAttachmentName());
        notice.setAuthor(author);

        Notice savedNotice = noticeRepository.save(notice);
        return convertToDTO(savedNotice);
    }

    // 공지 수정 (작성자 또는 관리자)
    @Transactional
    public NoticeDTO updateNotice(Long id, CreateNoticeRequest request, String username) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));

        // 작성자 확인 (관리자는 AuthController에서 처리)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!notice.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only edit your own notices");
        }

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setIsPublic(request.getIsPublic());
        notice.setImageUrl(request.getImageUrl());
        notice.setAttachmentUrl(request.getAttachmentUrl());
        notice.setAttachmentName(request.getAttachmentName());

        Notice updatedNotice = noticeRepository.save(notice);
        return convertToDTO(updatedNotice);
    }

    // 공지 삭제 (작성자 또는 관리자)
    @Transactional
    public void deleteNotice(Long id, String username) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));

        // 작성자 확인 (관리자는 AuthController에서 처리)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Researcher currentUser = user.getResearcher();
        if (currentUser == null) {
            throw new RuntimeException("User does not have an associated researcher profile");
        }

        if (!notice.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own notices");
        }

        noticeRepository.delete(notice);
    }

    // 관리자용 공지 수정 (작성자 확인 없음)
    @Transactional
    public NoticeDTO updateNoticeByAdmin(Long id, CreateNoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setIsPublic(request.getIsPublic());
        notice.setImageUrl(request.getImageUrl());
        notice.setAttachmentUrl(request.getAttachmentUrl());
        notice.setAttachmentName(request.getAttachmentName());

        Notice updatedNotice = noticeRepository.save(notice);
        return convertToDTO(updatedNotice);
    }

    // 관리자용 공지 삭제 (작성자 확인 없음)
    @Transactional
    public void deleteNoticeByAdmin(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));
        noticeRepository.delete(notice);
    }

    // Entity to DTO
    private NoticeDTO convertToDTO(Notice notice) {
        NoticeDTO dto = new NoticeDTO();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setContent(notice.getContent());
        dto.setIsPublic(notice.getIsPublic());
        dto.setImageUrl(notice.getImageUrl());
        dto.setAttachmentUrl(notice.getAttachmentUrl());
        dto.setAttachmentName(notice.getAttachmentName());
        dto.setAuthorId(notice.getAuthor().getId());
        dto.setAuthorName(notice.getAuthor().getName());
        dto.setCreatedAt(notice.getCreatedAt());
        dto.setUpdatedAt(notice.getUpdatedAt());
        return dto;
    }
}
