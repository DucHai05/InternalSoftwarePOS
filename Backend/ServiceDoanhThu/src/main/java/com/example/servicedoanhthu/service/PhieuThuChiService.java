package com.example.servicedoanhthu.service;

import com.example.servicedoanhthu.entity.Ca;
import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.entity.PhieuThuChi;
import com.example.servicedoanhthu.repository.CaRepository;
import com.example.servicedoanhthu.repository.DoanhThuRepository;
import com.example.servicedoanhthu.repository.PhieuThuChiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PhieuThuChiService {
    @Autowired
    private PhieuThuChiRepository phieuThuChiRepository;
    @Autowired
    private DoanhThuRepository doanhThuRepository;
    @Autowired
    private CaRepository caRepository;

    public List<PhieuThuChi> getAll() {
        return phieuThuChiRepository.findAll();
    }

    public PhieuThuChi getById(String maPhieu) {
        return phieuThuChiRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Khong tim thay phieu thu chi voi ma: " + maPhieu));
    }

    public List<PhieuThuChi> getByMaCa(String maCa) {
        return phieuThuChiRepository.findByMaCa(maCa);
    }

    @Transactional
    public PhieuThuChi create(PhieuThuChi phieuThuChi) {
        // 1. Kiểm tra số tiền hợp lệ
        if (phieuThuChi.getSoTien() == null || phieuThuChi.getSoTien() <= 0) {
            throw new RuntimeException("So tien khong hop le");
        }

        String loaiPhieu = normalize(phieuThuChi.getLoaiPhieu());
        String prefix = resolvePrefix(loaiPhieu);

        phieuThuChi.setLoaiPhieu(formatLoaiPhieu(loaiPhieu));
        phieuThuChi.setMaPhieu(generateMaPhieu(prefix));

        // 2. Lấy thông tin Ca và Doanh Thu liên quan
        Ca ca = caRepository.findById(phieuThuChi.getMaCa())
                .orElseThrow(() -> new RuntimeException("Khong tim thay ca voi ma: " + phieuThuChi.getMaCa()));

        DoanhThu doanhThu = doanhThuRepository.findByMaCa(phieuThuChi.getMaCa())
                .orElseGet(() -> initDoanhThu(phieuThuChi.getMaCa()));

        Double soTien = phieuThuChi.getSoTien();

        // 3. Logic cập nhật dòng tiền (Sử dụng Double cực gọn)
        if ("thu".equals(loaiPhieu)) {
            // Tăng tiền thu ở báo cáo + Tăng tiền mặt thực tế trong két
            doanhThu.setTienThu(handleNull(doanhThu.getTienThu()) + soTien);
            ca.setSoTienKet(handleNull(ca.getSoTienKet()) + soTien);
        } else if ("chi".equals(loaiPhieu)) {
            // Tăng tiền chi ở báo cáo + Giảm tiền mặt thực tế trong két
            doanhThu.setTienChi(handleNull(doanhThu.getTienChi()) + soTien);
            ca.setSoTienKet(handleNull(ca.getSoTienKet()) - soTien);
        } else {
            throw new RuntimeException("Loai phieu khong hop le. Chi nhan 'Thu' hoac 'Chi'");
        }

        // 5. Lưu đồng bộ cả 3 bảng
        PhieuThuChi savedPhieuThuChi = phieuThuChiRepository.save(phieuThuChi);
        doanhThuRepository.save(doanhThu);
        caRepository.save(ca);

        return savedPhieuThuChi;
    }

    private DoanhThu initDoanhThu(String maCa) {
        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setMaDoanhThu("DT-" + maCa);
        doanhThu.setMaCa(maCa);
        doanhThu.setTienMat(0.0);
        doanhThu.setTienCK(0.0);
        doanhThu.setTienThu(0.0);
        doanhThu.setTienChi(0.0);
        return doanhThu;
    }

    // Helper cực kỳ quan trọng để tránh lỗi NullPointerException khi cộng trừ
    private Double handleNull(Double value) {
        return value == null ? 0.0 : value;
    }

    private String normalize(String loaiPhieu) {
        return loaiPhieu == null ? "" : loaiPhieu.trim().toLowerCase();
    }

    private String resolvePrefix(String loaiPhieu) {
        if ("thu".equals(loaiPhieu)) return "THU";
        if ("chi".equals(loaiPhieu)) return "CHI";
        throw new RuntimeException("Loai phieu khong hop le");
    }

    private String formatLoaiPhieu(String loaiPhieu) {
        return "thu".equals(loaiPhieu) ? "Thu" : "Chi";
    }

    private String generateMaPhieu(String prefix) {
        int nextNumber = phieuThuChiRepository.findTopByMaPhieuStartingWithOrderByMaPhieuDesc(prefix)
                .map(PhieuThuChi::getMaPhieu)
                .map(this::extractSequenceNumber)
                .orElse(0) + 1;

        return "%s%03d".formatted(prefix, nextNumber);
    }

    private int extractSequenceNumber(String maPhieu) {
        try {
            return Integer.parseInt(maPhieu.replaceAll("\\D+", ""));
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}