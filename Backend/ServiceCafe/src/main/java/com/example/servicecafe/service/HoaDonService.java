package com.example.servicecafe.service;

import com.example.servicecafe.entity.HoaDon;
import com.example.servicecafe.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    // 1. Lấy toàn bộ danh sách hóa đơn
    public List<HoaDon> getAll() {
        return hoaDonRepository.findAll();
    }

    // 2. Lấy chi tiết một hóa đơn theo mã
    public HoaDon getById(String maHoaDon) {
        return hoaDonRepository.findById(maHoaDon)
                .orElseThrow(() -> new RuntimeException("Khong tim thay hoa don voi ma: " + maHoaDon));
    }

    // 3. Lọc hóa đơn theo mã bàn
    public List<HoaDon> getByMaBan(String maBan) {
        return hoaDonRepository.findByMaBan(maBan);
    }

    // 4. Lọc hóa đơn theo mã ca làm việc
    public List<HoaDon> getByMaCa(String maCa) {
        return hoaDonRepository.findByMaCa(maCa);
    }
}