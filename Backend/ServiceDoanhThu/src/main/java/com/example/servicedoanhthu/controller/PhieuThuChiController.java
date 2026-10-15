package com.example.servicedoanhthu.controller;

import com.example.servicedoanhthu.entity.PhieuThuChi;
import com.example.servicedoanhthu.service.PhieuThuChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/phieuthuchi")
@CrossOrigin(origins = "*")
public class PhieuThuChiController {
    @Autowired
    private PhieuThuChiService service;

    @GetMapping
    public List<PhieuThuChi> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maPhieu}")
    public PhieuThuChi getById(@PathVariable String maPhieu) {
        return service.getById(maPhieu);
    }

    @GetMapping("/ca/{maCa}")
    public List<PhieuThuChi> getByMaCa(@PathVariable String maCa) {
        return service.getByMaCa(maCa);
    }

    @PostMapping
    public PhieuThuChi create(@RequestBody PhieuThuChi phieuThuChi) {
        return service.create(phieuThuChi);
    }
}
