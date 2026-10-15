package com.example.servicetable.repository;

import com.example.servicetable.entity.Ban;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BanRepository extends JpaRepository<Ban, String> {
    // Tên hàm phải là findBy + TênBiếnKhuVuc + TênBiếnMãKhuVuc (viết hoa chữ cái đầu)
    List<Ban> findByKhuVucMaKhuVuc(String maKhuVuc);
    List<Ban> findByKhuVucMaKhuVucAndTrangThaiBanNot(String maKhuVuc, String trangThaiBan);
    List<Ban> findByTrangThaiBanContaining(String trangThaiBan);
    List<Ban> findByTrangThaiBanNot(String trangThaiBan);
    List<Ban> findTrangThaiThanhToanContainingByMaBan(String maBan);
    Optional<Ban> findTopByMaBanStartingWithOrderByMaBanDesc(String prefix);


    @Modifying
    @Transactional
    @Query("UPDATE Ban b SET b.trangThaiThanhToan = :status WHERE b.maBan = :maBan")
    void updateTrangThaiThanhToan(@Param("maBan") String maBan, @Param("status") String status);
}
