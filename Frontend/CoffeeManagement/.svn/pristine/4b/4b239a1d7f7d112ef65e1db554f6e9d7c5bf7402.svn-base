package com.example.servicecafe.controller;

import com.example.servicecafe.entity.HoaDon;
import com.example.servicecafe.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hoadon")
public class HoaDonController {
    @Autowired
    private HoaDonService service;

    @GetMapping
    public List<HoaDon> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maHoaDon}")
    public HoaDon getById(@PathVariable String maHoaDon) {
        return service.getById(maHoaDon);
    }

    @GetMapping("/ban/{maBan}")
    public List<HoaDon> getByMaBan(@PathVariable String maBan) {
        return service.getByMaBan(maBan);
    }

    @GetMapping("/ca/{maCa}")
    public List<HoaDon> getByMaCa(@PathVariable String maCa) {
        return service.getByMaCa(maCa);
    }
}
