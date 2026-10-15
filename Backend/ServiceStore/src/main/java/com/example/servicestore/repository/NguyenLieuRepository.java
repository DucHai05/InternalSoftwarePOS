package com.example.servicestore.repository; // Đổi dòng này

import com.example.servicestore.entity.NguyenLieu; // Đổi dòng này
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NguyenLieuRepository extends JpaRepository<NguyenLieu, String> {
    // Đã xóa hàm findShortageIngredients chứa CongThuc
}