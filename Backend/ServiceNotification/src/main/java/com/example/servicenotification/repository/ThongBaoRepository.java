package com.example.servicenotification.repository;

import com.example.servicenotification.entity.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Integer> {
    
    // Đếm số lượng thông báo chưa đọc của 1 nhân viên
    long countByMaNhanVienAndDaDocFalse(String maNhanVien);

    // Lấy danh sách thông báo của 1 nhân viên, sắp xếp giảm dần theo thời gian tạo
    List<ThongBao> findByMaNhanVienOrderByNgayTaoDesc(String maNhanVien);
}