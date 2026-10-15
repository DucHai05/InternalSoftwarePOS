package com.example.servicenotification.controller;

import com.example.servicenotification.entity.ThongBao;
import com.example.servicenotification.service.ThongBaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*") // Hỗ trợ CORS cho Frontend gọi
public class ThongBaoController {

    @Autowired
    private ThongBaoService thongBaoService;

    // API để Service khác (ví dụ: OrderService) gọi vào để tạo thông báo
    @PostMapping("/create")
    public ResponseEntity<ThongBao> createNotification(@RequestBody ThongBao thongBao) {
        return ResponseEntity.ok(thongBaoService.taoThongBao(thongBao));
    }

    // API lấy số lượng chưa đọc hiển thị lên chuông
    @GetMapping("/unread-count/{maNhanVien}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String maNhanVien) {
        return ResponseEntity.ok(thongBaoService.demThongBaoChuaDoc(maNhanVien));
    }

    // API lấy danh sách thông báo để đổ vào Dropdown
    @GetMapping("/list/{maNhanVien}")
    public ResponseEntity<List<ThongBao>> getNotifications(@PathVariable String maNhanVien) {
        return ResponseEntity.ok(thongBaoService.layDanhSachThongBao(maNhanVien));
    }

    // API đánh dấu đã đọc khi người dùng click vào thông báo
    @PutMapping("/read/{maThongBao}")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer maThongBao) {
        thongBaoService.danhDauDaDoc(maThongBao);
        return ResponseEntity.ok().build();
    }
}