package com.lab.management.repository;

import com.lab.management.entity.LabInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabInfoRepository extends JpaRepository<LabInfo, Long> {
}
