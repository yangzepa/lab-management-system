package com.lab.management.repository;

import com.lab.management.entity.Seminar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SeminarRepository extends JpaRepository<Seminar, Long> {

    List<Seminar> findAllByOrderBySeminarDateDesc();

    List<Seminar> findByIsPublicTrueOrderBySeminarDateDesc();

    @Query("SELECT s FROM Seminar s WHERE s.seminarDate >= :startDate AND s.seminarDate <= :endDate ORDER BY s.seminarDate")
    List<Seminar> findBySeminarDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Seminar> findByTopicOrderBySeminarDateDesc(String topic);

    List<Seminar> findByPresenterIdOrderBySeminarDateDesc(Long presenterId);
}
