package com.lab.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lab_info")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String university;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String professor;

    @Column(nullable = false, unique = true)
    private String email;

    private String website;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(columnDefinition = "TEXT")
    private String researchFocus;

    private String address;

    private String logoUrl;
}
