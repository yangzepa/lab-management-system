package com.lab.management.repository;

import com.lab.management.entity.ProjectHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectHistoryRepository extends JpaRepository<ProjectHistory, Long> {
    List<ProjectHistory> findByProjectIdOrderByCreatedAtDesc(Long projectId, Pageable pageable);
    void deleteByProjectId(Long projectId);
}
