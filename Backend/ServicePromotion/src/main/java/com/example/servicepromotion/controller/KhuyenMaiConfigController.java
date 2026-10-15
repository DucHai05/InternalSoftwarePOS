package com.example.servicepromotion.controller;


import com.example.servicepromotion.entity.KhuyenMaiConfig;
import com.example.servicepromotion.service.KhuyenMaiConfigService;
import com.example.servicepromotion.dto.KhuyenMaiConfigDTO;
import com.example.servicepromotion.repository.KhuyenMaiConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotion-configs")
public class KhuyenMaiConfigController {

    @Autowired
    private KhuyenMaiConfigService configService;

    @Autowired
    private KhuyenMaiConfigRepository configRepo; // Dùng để tìm config theo ID

    // 1. Lấy tất cả cấu hình của một mã khuyến mãi
    // URL: GET /api/promotion-configs/promo/HE2024
    @GetMapping("/promo/{maKM}")
    public ResponseEntity<List<KhuyenMaiConfig>> getConfigsByPromo(@PathVariable String maKM) {
        List<KhuyenMaiConfig> configs = configService.getConfigsByPromo(maKM);
        return ResponseEntity.ok(configs);
    }

    // 2. Lưu mới hoặc cập nhật một cấu hình
    // URL: POST /api/promotion-configs
    @PostMapping
    public ResponseEntity<KhuyenMaiConfig> createConfig(@RequestBody KhuyenMaiConfig config) {
        KhuyenMaiConfig saved = configService.saveConfig(config);
        return ResponseEntity.ok(saved);
    }

    // 3. API "Thần thánh": Kiểm tra xem đơn hàng có được áp dụng mã này không
    // URL: POST /api/promotion-configs/check
    @PostMapping("/check")
    public ResponseEntity<Boolean> checkEligibility(@RequestBody KhuyenMaiConfigDTO request) {
        // Tìm cái config trong DB trước
        return configRepo.findById(request.getIdConfig())
                .map(config -> {
                    // Gọi service xử lý logic mà ông đã viết
                    boolean isEligible = configService.checkEligibility(
                            config,
                            request.getTotalAmount(), // Đổi totalAmount() -> getTotalAmount()
                            request.isHasCafe()
                    );
                    return ResponseEntity.ok(isEligible);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}