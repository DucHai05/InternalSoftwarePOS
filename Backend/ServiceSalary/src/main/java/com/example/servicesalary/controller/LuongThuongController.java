package com.example.servicesalary.controller;

import com.example.servicesalary.repository.ChamCongRepository;
import com.example.servicesalary.repository.LuongThuongRepository;
import lombok.RequiredArgsConstructor;
import com.example.servicesalary.entity.LuongThuong;
import com.example.servicesalary.service.LuongThuongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class LuongThuongController {

    private final LuongThuongService service;
    private final ChamCongRepository chamCongRepo;
    private final LuongThuongRepository luongThuongRepo;

    @GetMapping("/all")
    public List<LuongThuong> getAll(@RequestParam Integer thang, @RequestParam Integer nam) {
        return service.getByMonth(thang, nam);
    }

    @PostMapping("/adjustment")
    public ResponseEntity<LuongThuong> createAdj(@RequestBody LuongThuong req) {
        return ResponseEntity.ok(service.addAdjustment(req));
    }

    @PutMapping("/pay/{maNV}")
    public ResponseEntity<String> pay(@PathVariable String maNV, @RequestParam Integer thang, @RequestParam Integer nam) {
        service.updatePaymentStatus(maNV, thang, nam);
        return ResponseEntity.ok("Thành công");
    }

    @PostMapping("/calculate-all")
    public ResponseEntity<String> calculateAll(@RequestBody Map<String, Integer> request) {
        try {
            Integer thang = request.get("thang");
            Integer nam = request.get("nam");

            // 1. Kiểm tra nghiệp vụ cơ bản
            if (thang == null || nam == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin tháng hoặc năm");
            }
            // 2. Gọi service (Token đã được Feign Interceptor tự động xử lý ngầm)
            service.tinhLuongDongLoat(thang, nam);

            return ResponseEntity.ok("Đã tổng hợp lương thành công cho tháng " + thang + "/" + nam);

        } catch (feign.FeignException.Unauthorized e) {
            // Bắt riêng lỗi 401 từ ServiceUser nếu Token hết hạn/sai
            return ResponseEntity.status(401).body("Phiên làm việc hết hạn hoặc không có quyền gọi Service nhân viên");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdjustment(@RequestBody LuongThuong adjustment) {
        try {
            LuongThuong saved = service.saveAdjustment(adjustment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lưu điều chỉnh: " + e.getMessage());
        }
    }
    @GetMapping("/check-history/{maNV}")
    public ResponseEntity<Boolean> checkHistory(@PathVariable String maNV) {
        boolean hasHistory = chamCongRepo.existsByMaNhanVien(maNV)
                || luongThuongRepo.existsByMaNhanVien(maNV);
        return ResponseEntity.ok(hasHistory);
    }
}
