package com.example.servicedoanhthu.repository;

import com.example.servicedoanhthu.entity.PhieuThuChi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PhieuThuChiRepository extends JpaRepository<PhieuThuChi, String> {
    List<PhieuThuChi> findByMaCa(String maCa);
    Optional<PhieuThuChi> findTopByMaPhieuStartingWithOrderByMaPhieuDesc(String prefix);
}
