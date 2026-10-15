package com.example.servicecafe.controller;

import com.example.servicecafe.entity.ChiTietHD;
import com.example.servicecafe.service.ChiTietHDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chitiethd")
@CrossOrigin(origins = "*")
public class ChiTietHDController {
    @Autowired
    private ChiTietHDService service;

    @GetMapping
    public List<ChiTietHD> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maChiTietHD}")
    public ChiTietHD getById(@PathVariable String maChiTietHD) {
        return service.getById(maChiTietHD);
    }

    @GetMapping("/hoadon/{maHoaDon}")
    public List<ChiTietHD> getByMaHoaDon(@PathVariable String maHoaDon) {
        return service.getByMaHoaDon(maHoaDon);
    }
}
