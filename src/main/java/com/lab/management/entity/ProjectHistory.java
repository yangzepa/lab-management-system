package com.lab.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_history", indexes = {
    @Index(name = "idx_project_history_project_id", columnList = "project_id"),
    @Index(name = "idx_project_history_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "researcher_id", nullable = false)
    private Researcher researcher;

    @Column(nullable = false, length = 50)
    private String action; // CREATED, UPDATED, DELETED, TASK_CREATED, TASK_UPDATED, TASK_DELETED, RESEARCHER_ADDED, RESEARCHER_REMOVED

    @Column(columnDefinition = "TEXT")
    private String description; // "프로젝트 생성", "진행률 40% → 50%", "태스크 '데이터 수집' 생성"

    @Column(columnDefinition = "TEXT")
    private String details; // JSON format for detailed changes

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
