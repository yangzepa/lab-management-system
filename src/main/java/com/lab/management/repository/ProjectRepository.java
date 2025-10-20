package com.lab.management.repository;

import com.lab.management.entity.Project;
import com.lab.management.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByStatusOrderByStartDateDesc(ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE p.endDate >= :date AND p.status != 'COMPLETED'")
    List<Project> findActiveProjectsAfterDate(@Param("date") LocalDate date);

    @Query("SELECT p FROM Project p WHERE p.status IN ('PLANNING', 'IN_PROGRESS') ORDER BY p.priority DESC, p.startDate DESC")
    List<Project> findAllActiveProjects();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    long countByStatus(ProjectStatus status);

    @Query("SELECT p FROM Project p JOIN p.researchers r WHERE r.id = :researcherId")
    List<Project> findByResearcherId(@Param("researcherId") Long researcherId);
}
