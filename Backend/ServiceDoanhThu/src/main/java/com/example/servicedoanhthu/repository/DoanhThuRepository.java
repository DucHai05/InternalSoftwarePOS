package com.example.servicedoanhthu.repository;

import com.example.servicedoanhthu.entity.DoanhThu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoanhThuRepository extends JpaRepository<DoanhThu, String> {
    Optional<DoanhThu> findByMaCa(String maCa);
    Optional<DoanhThu> findFirstByMaCa(String maCa);
    Optional<DoanhThu> findTopByOrderByMaDoanhThuDesc();
}