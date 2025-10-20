package com.lab.management.repository;

import com.lab.management.entity.ResearchArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResearchAreaRepository extends JpaRepository<ResearchArea, Long> {
    Optional<ResearchArea> findByName(String name);
    boolean existsByName(String name);
}
