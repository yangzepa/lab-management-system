package com.lab.management.repository;

import com.lab.management.entity.Researcher;
import com.lab.management.entity.ResearcherStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearcherRepository extends JpaRepository<Researcher, Long> {

    Optional<Researcher> findByStudentId(String studentId);

    Optional<Researcher> findByEmail(String email);

    List<Researcher> findByStatus(ResearcherStatus status);

    List<Researcher> findByStatusOrderByJoinDateDesc(ResearcherStatus status);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);

    @Query("SELECT r FROM Researcher r WHERE r.status = 'ACTIVE' ORDER BY r.joinDate DESC")
    List<Researcher> findAllActiveResearchers();

    @Query("SELECT COUNT(r) FROM Researcher r WHERE r.status = :status")
    long countByStatus(ResearcherStatus status);
}
