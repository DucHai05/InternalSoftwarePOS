package com.example.servicedoanhthu.service;

import com.example.servicedoanhthu.entity.Ca;
import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.repository.CaRepository;
import com.example.servicedoanhthu.repository.DoanhThuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CaService {
    private static final String TRANG_THAI_MO = "Mở";
    private static final String TRANG_THAI_DONG = "Đóng";
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter TEN_CA_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM");

    @Autowired
    private CaRepository caRepository;

    @Autowired
    private DoanhThuRepository doanhThuRepository;

    public List<Ca> getAll() {
        return caRepository.findAll();
    }

    public Ca getById(String maCa) {
        return caRepository.findById(maCa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca với mã: " + maCa));
    }

    public List<Ca> getByNgayThang(LocalDate ngayThang) {
        return caRepository.findByNgayThang(ngayThang);
    }

    public List<Ca> getByMaNhanVien(String maNhanVien) {
        return caRepository.findByMaNhanVien(maNhanVien);
    }

    public Map<String, Object> checkOpenCa() {
        Ca caDangMo = caRepository.findFirstByTrangThaiOrderByNgayThangDescGioMoCaDesc(TRANG_THAI_MO).orElse(null);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("coCaDangMo", caDangMo != null);
        response.put("batBuocMoCa", caDangMo == null);
        response.put("message", caDangMo != null
                ? "Đang có ca mở. Hiển thị chi tiết ca hiện tại."
                : "Không có ca nào đang mở. Vui lòng mở ca và nhập số tiền trong két.");
        response.put("ca", caDangMo);
        return response;
    }

    @Transactional
    public Ca openCa(Double soTienKet, String maNhanVien) {
        if (soTienKet == null) {
            throw new IllegalArgumentException("Số tiền trong két là bắt buộc.");
        }

        if (soTienKet < 0) {
            throw new IllegalArgumentException("Số tiền trong két không được âm.");
        }
        if (maNhanVien == null || maNhanVien.isBlank()) {
            throw new IllegalArgumentException("Mã nhân viên đang đăng nhập là bắt buộc.");
        }

        Ca caDangMo = caRepository.findFirstByTrangThaiOrderByNgayThangDescGioMoCaDesc(TRANG_THAI_MO).orElse(null);
        if (caDangMo != null) {
            throw new IllegalStateException("Đang có ca mở: " + caDangMo.getMaCa());
        }

        LocalDate ngayMoCa = LocalDate.now(VIETNAM_ZONE);
        LocalTime gioMoCa = LocalTime.now(VIETNAM_ZONE);

        Ca ca = new Ca();
        ca.setMaCa(generateNextCaCode());
        ca.setMaNhanVien(maNhanVien.trim());
        ca.setNgayThang(ngayMoCa);
        ca.setSoTienKet(soTienKet);
        ca.setTenCa(buildTenCa(gioMoCa, ngayMoCa));
        ca.setTrangThai(TRANG_THAI_MO);
        ca.setGioMoCa(gioMoCa);
        ca.setGioDongCa(null);

        Ca savedCa = caRepository.save(ca);
        // Tự động tạo bản ghi doanh thu trống cho ca mới
        doanhThuRepository.save(createDoanhThu(savedCa.getMaCa()));
        return savedCa;
    }

    @Transactional
    public Ca closeCa(String maCa) {
        Ca ca = caRepository.findById(maCa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca với mã: " + maCa));

        ca.setGioDongCa(LocalTime.now(VIETNAM_ZONE));
        ca.setTrangThai(TRANG_THAI_DONG);

        return caRepository.save(ca);
    }

    private DoanhThu createDoanhThu(String maCa) {
        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setMaDoanhThu(generateNextDoanhThuCode());
        doanhThu.setMaCa(maCa);
        doanhThu.setTienCK(0.0);
        doanhThu.setTienChi(0.0);
        doanhThu.setTienMat(0.0);
        doanhThu.setTienThu(0.0);
        return doanhThu;
    }

    private String generateNextCaCode() {
        String lastCode = caRepository.findTopByOrderByMaCaDesc()
                .map(Ca::getMaCa)
                .orElse(null);
        return generateNextCode("CA", lastCode);
    }

    private String generateNextDoanhThuCode() {
        String lastCode = doanhThuRepository.findTopByOrderByMaDoanhThuDesc()
                .map(DoanhThu::getMaDoanhThu)
                .orElse(null);
        return generateNextCode("DT", lastCode);
    }

    private String generateNextCode(String prefix, String lastCode) {
        int nextNumber = 1;
        if (lastCode != null && lastCode.startsWith(prefix)) {
            String numericPart = lastCode.substring(prefix.length());
            try {
                nextNumber = Integer.parseInt(numericPart) + 1;
            } catch (NumberFormatException ignored) {
                nextNumber = 1;
            }
        }
        return prefix + String.format("%03d", nextNumber);
    }

    private String buildTenCa(LocalTime gioMoCa, LocalDate ngayMoCa) {
        String buoi;
        if (gioMoCa.isBefore(LocalTime.NOON)) {
            buoi = "Sáng";
        } else if (gioMoCa.isBefore(LocalTime.of(18, 0))) {
            buoi = "Chiều";
        } else {
            buoi = "Tối";
        }
        return buoi + " " + ngayMoCa.format(TEN_CA_DATE_FORMAT);
    }

    public String getMaCaByTrangThaiOpen() {
        String maCa = caRepository.findMaCaByTrangThai(TRANG_THAI_MO);
        return maCa;
    }
}