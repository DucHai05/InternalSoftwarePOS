package com.example.servicecafe.repository;

import com.example.servicecafe.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoaDonRepository extends JpaRepository<HoaDon, String> {

    List<HoaDon> findByTrangThaiThanhToan(String trangThai);
    Optional<HoaDon> findTop1ByMaBanAndTrangThaiThanhToanOrderByThoiGianVaoDesc(String maBan, String trangThai);
    List<HoaDon> findByMaBan(String maBan);
    List<HoaDon> findByMaCa(String maCa);
}


