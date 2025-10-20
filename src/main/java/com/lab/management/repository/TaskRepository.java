package com.lab.management.repository;

import com.lab.management.entity.Task;
import com.lab.management.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a.id = :researcherId")
    List<Task> findByResearcherId(@Param("researcherId") Long researcherId);

    @Query("SELECT t FROM Task t WHERE t.dueDate <= :date AND t.status != 'DONE'")
    List<Task> findOverdueTasks(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startDate AND :endDate AND t.status != 'DONE'")
    List<Task> findTasksDueBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);
}
