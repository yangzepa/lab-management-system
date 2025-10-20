package com.lab.management.service;

import com.lab.management.entity.ResearchArea;
import com.lab.management.repository.ResearchAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResearchAreaService {

    private final ResearchAreaRepository researchAreaRepository;

    public List<ResearchArea> getAllResearchAreas() {
        return researchAreaRepository.findAll();
    }

    public ResearchArea getResearchAreaById(Long id) {
        return researchAreaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Research area not found with id: " + id));
    }

    @Transactional
    public ResearchArea createResearchArea(String name, String description) {
        if (researchAreaRepository.existsByName(name)) {
            throw new IllegalArgumentException("Research area already exists with name: " + name);
        }

        ResearchArea researchArea = ResearchArea.builder()
                .name(name)
                .description(description)
                .build();

        return researchAreaRepository.save(researchArea);
    }

    @Transactional
    public ResearchArea updateResearchArea(Long id, String name, String description) {
        ResearchArea researchArea = getResearchAreaById(id);

        if (name != null && !name.equals(researchArea.getName())) {
            if (researchAreaRepository.existsByName(name)) {
                throw new IllegalArgumentException("Research area already exists with name: " + name);
            }
            researchArea.setName(name);
        }

        if (description != null) {
            researchArea.setDescription(description);
        }

        return researchAreaRepository.save(researchArea);
    }

    @Transactional
    public void deleteResearchArea(Long id) {
        if (!researchAreaRepository.existsById(id)) {
            throw new IllegalArgumentException("Research area not found with id: " + id);
        }
        researchAreaRepository.deleteById(id);
    }
}
