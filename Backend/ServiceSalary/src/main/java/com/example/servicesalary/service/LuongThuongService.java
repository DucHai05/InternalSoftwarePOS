package com.example.servicesalary.service;

import com.example.servicesalary.client.UserClient;
import jakarta.transaction.Transactional;
import com.example.servicesalary.client.NotificationClient;
import com.example.servicesalary.dto.NhanVienDTO;
import com.example.servicesalary.entity.ChamCong;
import com.example.servicesalary.entity.LuongThuong;
import com.example.servicesalary.repository.ChamCongRepository;
import com.example.servicesalary.repository.LuongThuongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LuongThuongService {

    @Autowired
    private UserClient userClient;
    @Autowired
    private LuongThuongRepository repository;
    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private ChamCongRepository chamCongRepo;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<LuongThuong> getByMonth(Integer t, Integer n) {
        return repository.findByThangAndNam(t, n);
    }

    public LuongThuong addAdjustment(LuongThuong req) {
        String prefix = "THUONG".equalsIgnoreCase(req.getLoaiPhieu()) ? "T" : "P";
        String ma = prefix + System.currentTimeMillis() % 1000000;

        req.setMaPhieu(ma);
        req.setNgayTao(LocalDateTime.now());
        req.setTrangThaiLuong("Chưa thanh toán");

        if (!"LUONG".equalsIgnoreCase(req.getLoaiPhieu())) {
            req.setSoGioLam(0.0);
        }
        LuongThuong saved = repository.save(req);
        // 🔔 GỬI NOTIFICATION
        String tieuDe;
        String noiDung;

        if ("THUONG".equalsIgnoreCase(req.getLoaiPhieu())) {
            tieuDe = "Thưởng";
            noiDung = "Bạn được thưởng " + req.getSoTien() + " VNĐ";
        } else {
            tieuDe = "Phạt";
            noiDung = "Bạn bị phạt " + req.getSoTien() + " VNĐ";
        }

        // Trong LuongThuongService.java
        Map<String, Object> body = new HashMap<>();
        body.put("maNhanVien", req.getMaNhanVien());
        body.put("tieuDe", tieuDe);
        body.put("noiDung", noiDung);
        body.put("loaiThongBao", req.getLoaiPhieu());
        body.put("idThamChieu", req.getMaPhieu());

        notificationClient.send(body); // Gọi qua Feign cực kỳ gọn

        return saved;
    }

    public void updatePaymentStatus(String maNV, Integer t, Integer n) {
        List<LuongThuong> list = repository.findByMaNhanVienAndThangAndNam(maNV, t, n);
        for (LuongThuong item : list) {
            item.setTrangThaiLuong("Đã thanh toán");
        }
        repository.saveAll(list);
    }

    @Transactional
    public void tinhLuongDongLoat(Integer thang, Integer nam) { // Bỏ tham số String authorizationHeader

        // 1. Gọi lấy danh sách nhân viên cực kỳ gọn gàng
        // Token sẽ tự động được đính kèm nhờ Interceptor ở Bước 3
        List<NhanVienDTO> nhanViens = userClient.getAllNhanVien();

        if (nhanViens == null || nhanViens.isEmpty()) return;

        for (NhanVienDTO nv : nhanViens) {
            String maNV = nv.getMaNhanVien();

            // Xử lý logic tính lương như bình thường...
            List<ChamCong> listCCInMonth = chamCongRepo.findByMaNhanVienAndThangAndNam(maNV, thang, nam);
            if (listCCInMonth.isEmpty()) continue;

            double tongGioLam = listCCInMonth.stream()
                    .mapToDouble(cc -> cc.getSoGioLam() != null ? cc.getSoGioLam() : 0.0)
                    .sum();

            double mucLuong = nv.getTienLuong() != null ? nv.getTienLuong().doubleValue() : 30000.0;

            // Cập nhật Database
            saveOrUpdateLuong(maNV, thang, nam, tongGioLam, mucLuong);
        }
    }

    // Hàm phụ trợ để code sạch hơn (tùy chọn)
    private void saveOrUpdateLuong(String maNV, Integer thang, Integer nam, double gio, double muc) {
        LuongThuong lt = repository.findByMaNhanVienAndThangAndNam(maNV, thang, nam)
                .stream()
                .filter(r -> "LUONG".equalsIgnoreCase(r.getLoaiPhieu()))
                .findFirst()
                .orElse(new LuongThuong());

        if ("Đã thanh toán".equals(lt.getTrangThaiLuong())) return;

        if (lt.getMaPhieu() == null) {
            lt.setMaPhieu("PL" + System.nanoTime());
            lt.setMaNhanVien(maNV);
            lt.setLoaiPhieu("LUONG");
            lt.setThang(thang);
            lt.setNam(nam);
            lt.setNgayTao(LocalDateTime.now());
        }
        lt.setSoGioLam(gio);
        lt.setSoTien(gio * muc);
        lt.setTrangThaiLuong("Chưa thanh toán");
        repository.save(lt);
    }

    public LuongThuong saveAdjustment(LuongThuong adjustment) {
        if (adjustment.getMaPhieu() == null || adjustment.getMaPhieu().isEmpty()) {
            adjustment.setMaPhieu("ADJ" + System.nanoTime());
        }
        adjustment.setNgayTao(LocalDateTime.now());
        adjustment.setTrangThaiLuong("Chưa thanh toán");
        LuongThuong saved = repository.save(adjustment);
        // 🔔 GỬI NOTIFICATION
        String tieuDe;
        String noiDung;

        if ("THUONG".equalsIgnoreCase(adjustment.getLoaiPhieu())) {
            tieuDe = "Thưởng";
            noiDung = "Bạn được thưởng " + adjustment.getSoTien() + " VNĐ";
        } else {
            tieuDe = "Phạt";
            noiDung = "Bạn bị phạt " + adjustment.getSoTien() + " VNĐ";
        }

        // Trong LuongThuongService.java
        Map<String, Object> body = new HashMap<>();
        body.put("maNhanVien", adjustment.getMaNhanVien());
        body.put("tieuDe", tieuDe);
        body.put("noiDung", noiDung);
        body.put("loaiThongBao", adjustment.getLoaiPhieu());
        body.put("idThamChieu", adjustment.getMaPhieu());

        notificationClient.send(body); // Gọi qua Feign cực kỳ gọn
        return saved;
    }
}
