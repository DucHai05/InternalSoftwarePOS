package com.example.servicesalary.service;

import com.example.servicesalary.client.NotificationClient;
import com.example.servicesalary.dto.ChamCongDTO;
import com.example.servicesalary.entity.ChamCong;
import com.example.servicesalary.repository.ChamCongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChamCongService {
    @Autowired
    private NotificationClient notificationClient;
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final ChamCongRepository repo;

    private LocalDateTime nowInVietnam() {
        return LocalDateTime.now(VIETNAM_ZONE);
    }

    public Optional<ChamCong> layCaDangLam(String maNV) {
        return repo.findByMaNhanVienAndTrangThai(maNV, "Đang làm")
                .filter(cc -> Duration.between(cc.getThoiGianVao(), nowInVietnam()).toHours() < 12);
    }

    @Transactional
    public ChamCong thucHienChamCong(String maNV) {
        Optional<ChamCong> caDangLam = repo.findByMaNhanVienAndTrangThai(maNV, "Đang làm");

        if (caDangLam.isPresent()) {
            ChamCong cc = caDangLam.get();
            if (Duration.between(cc.getThoiGianVao(), nowInVietnam()).toHours() >= 12) {
                cc.setTrangThai("Lỗi ca");
                cc.setThoiGianRa(cc.getThoiGianVao());
                cc.setSoGioLam(0.0);
                repo.save(cc);
                return checkIn(maNV);
            }
            return checkOut(cc);
        }
        return checkIn(maNV);
    }

    private ChamCong checkIn(String maNV) {
        ZonedDateTime nowZoned = ZonedDateTime.now(VIETNAM_ZONE);
        LocalDateTime now = nowZoned.toLocalDateTime();
        int hour = nowZoned.getHour();
        String prefix;

        if (hour >= 6 && hour < 12) {
            prefix = "S";
        } else if (hour >= 12 && hour < 18) {
            prefix = "C";
        } else if (hour >= 18 && hour < 23) {
            prefix = "T";
        } else {
            throw new RuntimeException("Hệ thống chỉ cho phép vào ca từ 06:00 đến 23:00!");
        }

        ChamCong cc = new ChamCong();
        cc.setMaChamCong("CC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        cc.setMaNhanVien(maNV);
        cc.setMaCa(prefix + now.format(DateTimeFormatter.ofPattern("ddMMyy")));
        cc.setThoiGianVao(now);
        cc.setTrangThai("Đang làm");
        return repo.save(cc);
    }

    private ChamCong checkOut(ChamCong cc) {
        cc.setThoiGianRa(nowInVietnam());
        cc.setTrangThai("Hoàn thành");
        double hours = Duration.between(cc.getThoiGianVao(), cc.getThoiGianRa()).getSeconds() / 3600.0;
        cc.setSoGioLam(Math.round(hours * 100.0) / 100.0);
        return repo.save(cc);
    }

    public List<ChamCongDTO> getHistoryByMonth(String maNV, int month, int year) {
        return repo.findByMonth(maNV, month, year)
                .stream()
                .map(cc -> new ChamCongDTO(
                        cc.getThoiGianVao().toLocalDate().toString(),
                        cc.getThoiGianVao().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")),
                        cc.getThoiGianRa() != null ? cc.getThoiGianRa().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "--",
                        cc.getSoGioLam() != null ? cc.getSoGioLam() : 0
                ))
                .toList();
    }

    @Transactional
    public ChamCong fixCaLoi(String maNV, int d, int m, int y, String gioRaMoi, String role) {
        ChamCong cc = repo.findErrorShift(maNV, d, m, y, "Lỗi ca")
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy bản ghi 'Lỗi ca' nào cho ngày " + d + "/" + m + " trong hệ thống!"
                ));

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime timeRa = LocalTime.parse(gioRaMoi, timeFormatter);
        LocalDateTime dateTimeRa = LocalDateTime.of(cc.getThoiGianVao().toLocalDate(), timeRa);

        if (dateTimeRa.isBefore(cc.getThoiGianVao())) {
            throw new RuntimeException(
                    "Giờ ra (" + gioRaMoi + ") không được sớm hơn giờ vào ("
                            + cc.getThoiGianVao().format(DateTimeFormatter.ofPattern("HH:mm")) + ")!"
            );
        }

        cc.setThoiGianRa(dateTimeRa);
        cc.setTrangThai("Hoàn thành");

        double hours = Duration.between(cc.getThoiGianVao(), dateTimeRa).getSeconds() / 3600.0;
        cc.setSoGioLam(Math.round(hours * 100.0) / 100.0);

        ChamCong savedCC = repo.save(cc);
        // 2. Gửi thông báo nếu người sửa là nhân viên thường
        if ("STAFF".equals(role)) {
            try {
                Map<String, Object> body = new HashMap<>();
                body.put("maNhanVien", "ADMIN_GROUP"); // Mã quy ước cho các Quản lý
                body.put("tieuDe", "Cập nhật ca lỗi");
                body.put("noiDung", "Nhân viên " + maNV + " đã tự sửa giờ ra ngày " + d + "/" + m + " thành " + gioRaMoi);
                body.put("loaiThongBao", "FIX_CHAM_CONG");
                body.put("idThamChieu", maNV);
                body.put("daDoc", false);

                notificationClient.send(body);
            } catch (Exception e) {
                System.err.println("Lỗi gửi thông báo: " + e.getMessage());
            }
        }
        return savedCC;
    }
}
