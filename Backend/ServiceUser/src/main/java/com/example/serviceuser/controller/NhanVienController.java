package com.example.serviceuser.controller;

import com.example.serviceuser.entity.NhanVien;
import com.example.serviceuser.repository.NhanVienRepository;
import com.example.serviceuser.service.NhanVienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nhan-vien")
@RequiredArgsConstructor
public class NhanVienController {

    private final NhanVienService nhanVienService;
    private final NhanVienRepository nhanVienRepository;

    @GetMapping
    public ResponseEntity<List<NhanVien>> getAll() {
        return ResponseEntity.ok(nhanVienService.findAll());
    }

    @PostMapping
    public ResponseEntity<?> addNhanVien(@RequestBody NhanVien nv) {
        return ResponseEntity.ok(nhanVienService.addNhanVien(nv));
    }

    @PutMapping("/{maNhanVien}")
    public ResponseEntity<?> updateNhanVien(@PathVariable String maNhanVien, @RequestBody NhanVien request) {
        return ResponseEntity.ok(nhanVienService.update(maNhanVien, request));
    }

    @DeleteMapping("/{maNhanVien}")
    public ResponseEntity<?> delete(@PathVariable String maNhanVien) {
        try {
            // Gọi service xử lý logic xóa/ẩn
            nhanVienService.delete(maNhanVien);
            return ResponseEntity.ok("Thao tác thành công");
        } catch (RuntimeException e) {
            // Trả về lỗi cụ thể nếu không tìm thấy nhân viên hoặc lỗi logic khác
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            // Lỗi hệ thống 500
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping("/exists/{maNhanVien}")
    public ResponseEntity<Boolean> exists(@PathVariable String maNhanVien) {
        return ResponseEntity.ok(nhanVienService.existsById(maNhanVien));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVien> getById(@PathVariable String id) {
        return nhanVienRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return nhanVienService.getNhanVienByUsername(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // 1. Lấy tên nhân viên theo mã (Dùng để hiển thị tên trong các danh sách/hóa đơn)
    @GetMapping("/{id}/ten")
    public ResponseEntity<String> getTenByMa(@PathVariable String id) {
        return nhanVienRepository.findTenByMa(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Lấy tên của chính nhân viên đang đăng nhập (Dùng cho thanh Sidebar/Header)
    @GetMapping("/me/ten")
    public ResponseEntity<String> getMyName(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return nhanVienRepository.findTenByUsername(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
