package com.example.servicetable.controller;

import com.example.servicetable.dto.BanDTO;
import com.example.servicetable.entity.Ban;
import com.example.servicetable.service.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ban")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class BanController {
    @Autowired
    private BanService service;

    @GetMapping()
    public List<Ban> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maBan}")
    public Ban getById(@PathVariable String maBan) {
        return service.getById(maBan);
    }

    @GetMapping("/khuvuc/{maKhuVuc}")
    public List<Ban> getByKhuVuc(@PathVariable String maKhuVuc) {
        return service.getByKhuVuc(maKhuVuc);
    }

    @GetMapping("/ban-trong/{maBan}")
    public ResponseEntity<Ban> getBanTrong(@PathVariable String maBan) {

        Ban ban = service.getById(maBan);
        return ResponseEntity.ok(ban);
    }

    @PostMapping
    public Ban create(@RequestBody BanDTO banDTO) {
        // Gọi hàm create (có check trùng)
        return service.create(banDTO);
    }

    @PutMapping("/{id}")
    public Ban update(@PathVariable String id, @RequestBody BanDTO banDTO) {
        // Gọi hàm update (ghi đè dựa trên ID)
        return service.update(id, banDTO);
    }
    @PutMapping("/updateTrangThai/{id}")
    public ResponseEntity<String> updateTrangThai(
            @PathVariable String id,
            @RequestParam String status) {
        try {
            service.updateTrangThaiBan(id, status);
            return ResponseEntity.ok("Cập nhật trạng thái bàn " + id + " thành " + status + " thành công!");
        } catch (Exception e) {
            // Trả về lỗi 404 hoặc 500 nếu không tìm thấy bàn hoặc lỗi DB
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật bàn: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
