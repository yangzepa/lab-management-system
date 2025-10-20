package com.lab.management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seminars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seminar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "presenter_id")
    private Researcher presenter;

    @Column(nullable = false)
    private LocalDateTime seminarDate;

    @Column
    private String location;

    @Column
    private String topic; // Research, Technical, Paper Review, etc.

    @Column
    private Boolean isPublic = true;

    @Column
    private String attachmentUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
