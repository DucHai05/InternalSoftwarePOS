package com.example.servicepromotion.controller;

import com.example.servicepromotion.dto.KhuyenMaiDTO;
import com.example.servicepromotion.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class KhuyenMaiController {

    @Autowired
    private KhuyenMaiService khuyenMaiService;

    // 1. LẤY TẤT CẢ (Cho trang quản lý)
    @GetMapping
    public ResponseEntity<List<KhuyenMaiDTO>> getAll() {
        return ResponseEntity.ok(khuyenMaiService.getAllPromotions());
    }

    // 2. LẤY CÁC MÃ ĐANG BẬT (Cho trang bán hàng OrderPage)
    @GetMapping("/active")
    public ResponseEntity<List<KhuyenMaiDTO>> getActive() {
        return ResponseEntity.ok(khuyenMaiService.getActivePromotions());
    }

    // 3. THÊM MỚI
    @PostMapping
    public ResponseEntity<String> create(@RequestBody KhuyenMaiDTO dto) {
        khuyenMaiService.savePromotion(dto);
        return ResponseEntity.ok("Tạo khuyến mãi thành công!");
    }

    // 4. CẬP NHẬT (Bổ sung để khớp với axios.put trong React)
    @PutMapping("/{id}")
    public ResponseEntity<String> update(@PathVariable String id, @RequestBody KhuyenMaiDTO dto) {
        khuyenMaiService.updatePromotion(id, dto); // Đảm bảo Service của Hải đã có hàm này
        return ResponseEntity.ok("Cập nhật thành công!");
    }

    // 5. BẬT/TẮT NHANH (Cho nút gạt Toggle)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> toggleStatus(@PathVariable String id) {
        khuyenMaiService.toggleStatus(id);
        return ResponseEntity.noContent().build();
    }

    // 6. XÓA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        khuyenMaiService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}