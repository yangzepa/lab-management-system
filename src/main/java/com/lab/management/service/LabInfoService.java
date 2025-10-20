package com.lab.management.service;

import com.lab.management.dto.request.LabInfoRequest;
import com.lab.management.dto.response.LabInfoResponse;
import com.lab.management.entity.LabInfo;
import com.lab.management.repository.LabInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LabInfoService {

    private final LabInfoRepository labInfoRepository;

    @Transactional(readOnly = true)
    public LabInfoResponse getLabInfo() {
        LabInfo labInfo = labInfoRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lab information not found"));

        return convertToResponse(labInfo);
    }

    @Transactional
    public LabInfoResponse updateLabInfo(LabInfoRequest request) {
        LabInfo labInfo = labInfoRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> LabInfo.builder().build());

        labInfo.setName(request.getName());
        labInfo.setUniversity(request.getUniversity());
        labInfo.setDepartment(request.getDepartment());
        labInfo.setProfessor(request.getProfessor());
        labInfo.setEmail(request.getEmail());
        labInfo.setWebsite(request.getWebsite());
        labInfo.setPhone(request.getPhone());
        labInfo.setIntroduction(request.getIntroduction());
        labInfo.setResearchFocus(request.getResearchFocus());
        labInfo.setAddress(request.getAddress());
        labInfo.setLogoUrl(request.getLogoUrl());

        LabInfo savedLabInfo = labInfoRepository.save(labInfo);
        return convertToResponse(savedLabInfo);
    }

    private LabInfoResponse convertToResponse(LabInfo labInfo) {
        return LabInfoResponse.builder()
                .id(labInfo.getId())
                .name(labInfo.getName())
                .university(labInfo.getUniversity())
                .department(labInfo.getDepartment())
                .professor(labInfo.getProfessor())
                .email(labInfo.getEmail())
                .website(labInfo.getWebsite())
                .phone(labInfo.getPhone())
                .introduction(labInfo.getIntroduction())
                .researchFocus(labInfo.getResearchFocus())
                .address(labInfo.getAddress())
                .logoUrl(labInfo.getLogoUrl())
                .build();
    }
}
