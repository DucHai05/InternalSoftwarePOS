package com.example.servicepromotion.repository;

import com.example.servicepromotion.entity.KhuyenMai;
import com.example.servicepromotion.entity.KhuyenMaiConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface KhuyenMaiConfigRepository extends JpaRepository<KhuyenMaiConfig, Long> {

    // 1. Tìm danh sách cấu hình dựa vào Mã Khuyến Mãi (Dùng cho ServiceConfig)
    // Spring sẽ tự hiểu: KhuyenMai (đối tượng) -> MaKhuyenMai (trường bên trong đối tượng đó)
    List<KhuyenMaiConfig> findByKhuyenMaiMaKhuyenMai(String maKhuyenMai);

    // 2. Xoá toàn bộ cấu hình của một Khuyến mãi (Dùng cho logic UPDATE ở Service)
    @Modifying // Bắt buộc có khi dùng delete hoặc update
    @Transactional // Đảm bảo việc xoá được thực thi trong một giao dịch
    void deleteByKhuyenMai(KhuyenMai khuyenMai);

    // Nếu Hải muốn xoá theo String ID của Khuyến mãi cho tiện, có thể dùng hàm này:
    @Modifying
    @Transactional
    void deleteByKhuyenMaiMaKhuyenMai(String maKhuyenMai);
}