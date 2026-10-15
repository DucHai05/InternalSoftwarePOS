package com.example.servicepromotion.service;


import com.example.servicepromotion.entity.KhuyenMaiConfig;
import com.example.servicepromotion.repository.KhuyenMaiConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KhuyenMaiConfigService {

    @Autowired
    private KhuyenMaiConfigRepository configRepo;

    // 1. Lấy danh sách cấu hình của một mã
    public List<KhuyenMaiConfig> getConfigsByPromo(String maKM) {
        return configRepo.findByKhuyenMaiMaKhuyenMai(maKM);
    }

    // 2. Lưu hoặc Cập nhật cấu hình
    @Transactional
    public KhuyenMaiConfig saveConfig(KhuyenMaiConfig config) {
        return configRepo.save(config);
    }


    public boolean checkEligibility(KhuyenMaiConfig config, double totalAmount, boolean hasCafe) {

        // TRƯỜNG HỢP 1: Mã áp dụng cho tất cả (ALL) - Thường là ngày lễ
        if ("ALL".equalsIgnoreCase(config.getLoaiDoiTuong())) {
            // Phải thỏa mãn số tiền tối thiểu mới cho áp dụng
            return totalAmount >= config.getGiaTriDonToiThieu();
        }

        // TRƯỜNG HỢP 2: Mã tùy chọn (SELECTIVE) - Nhân viên tự chọn cho khách
        if ("SELECTIVE".equalsIgnoreCase(config.getLoaiDoiTuong())) {
            // Nếu có giới hạn món (ví dụ: chỉ giảm khi mua CAFE)
            if ("CAFE".equalsIgnoreCase(config.getApDungChoMon())) {
                return hasCafe && totalAmount >= config.getGiaTriDonToiThieu();
            }
            // Nếu không giới hạn món (ALL món)
            return totalAmount >= config.getGiaTriDonToiThieu();
        }

        return false;
    }
}