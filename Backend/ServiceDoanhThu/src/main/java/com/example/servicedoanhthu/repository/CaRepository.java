package com.example.servicedoanhthu.repository;

import com.example.servicedoanhthu.entity.Ca;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CaRepository extends JpaRepository<Ca, String> {
    List<Ca> findByNgayThang(LocalDate ngayThang);
    List<Ca> findByMaNhanVien(String maNhanVien);
    Optional<Ca> findFirstByTrangThaiOrderByNgayThangDescGioMoCaDesc(String trangThai);
    Optional<Ca> findTopByOrderByMaCaDesc();

    @Query("SELECT c.maCa FROM Ca c WHERE c.trangThai LIKE %:trangThai%")
    String findMaCaByTrangThai(@Param("trangThai") String trangThai);

    @Modifying
    @Transactional
    @Query("UPDATE Ca c SET c.soTienKet = COALESCE(c.soTienKet, 0) + :tienMat WHERE c.maCa = :maCa")
    int incrementSoTienKetByMaCa(@Param("maCa") String maCa, @Param("tienMat") Double tienMat);
}
