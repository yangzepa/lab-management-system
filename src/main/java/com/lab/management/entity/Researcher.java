package com.lab.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "researchers", indexes = {
    @Index(name = "idx_student_id", columnList = "student_id"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Researcher extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResearcherStatus status = ResearcherStatus.ACTIVE;

    @NotNull
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "researcher_research_areas", joinColumns = @JoinColumn(name = "researcher_id"))
    @Column(name = "research_area")
    @Builder.Default
    private List<String> researchAreas = new ArrayList<>();

    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToMany(mappedBy = "researchers", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @ManyToMany(mappedBy = "assignees", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();

    @OneToOne(mappedBy = "researcher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;
}
