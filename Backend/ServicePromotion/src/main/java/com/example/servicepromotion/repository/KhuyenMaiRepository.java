package com.example.servicepromotion.repository;

import com.example.servicepromotion.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Thêm annotation này để Spring quản lý tốt hơn
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, String> {

    /**
     * Tìm danh sách khuyến mãi đang hoạt động (trang_thai = 1)
     * Spring Data JPA sẽ tự hiểu và sinh ra câu lệnh SQL:
     * SELECT * FROM KhuyenMai WHERE trang_thai = 1
     */
    List<KhuyenMai> findByTrangThaiTrue();

    // Nếu sau này Hải muốn tìm theo loại (PERCENT/FIXED) thì thêm dòng này:
    // List<KhuyenMai> findByLoaiKhuyenMai(String loai);
}