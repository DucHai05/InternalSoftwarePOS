package com.example.servicedoanhthu.controller;

import com.example.servicedoanhthu.entity.Ca;
import com.example.servicedoanhthu.service.CaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ca")
@CrossOrigin(origins = "*")
public class CaController {
    @Autowired
    private CaService service;

    @GetMapping
    public List<Ca> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maCa}")
    public Ca getById(@PathVariable String maCa) {
        return service.getById(maCa);
    }

    @GetMapping("/ngay")
    public List<Ca> getByNgayThang(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayThang) {
        return service.getByNgayThang(ngayThang);
    }

    @GetMapping("/nhanvien/{maNhanVien}")
    public List<Ca> getByMaNhanVien(@PathVariable String maNhanVien) {
        return service.getByMaNhanVien(maNhanVien);
    }

    @GetMapping("/kiem-tra-ca-mo")
    public Map<String, Object> checkOpenCa() {
        return service.checkOpenCa();
    }

    @PostMapping("/mo-ca")
    public Ca openCa(@RequestParam Double soTienKet, @RequestParam String maNhanVien) {
        return service.openCa(soTienKet, maNhanVien);
    }

    @PutMapping("/{maCa}/dong-ca")
    public Ca closeCa(@PathVariable String maCa) {
        return service.closeCa(maCa);
    }

    @GetMapping("/getMaCaDangMo")
    public String getMacaByTrangThai() {
        return service.getMaCaByTrangThaiOpen();
    }

}