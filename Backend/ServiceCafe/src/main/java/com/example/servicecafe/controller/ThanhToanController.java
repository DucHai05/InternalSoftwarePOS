package com.example.servicecafe.controller;

import com.example.servicecafe.dto.PaymentDTO;
import com.example.servicecafe.service.ThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class ThanhToanController {

    @Autowired
    private ThanhToanService thanhToanService;

    @PostMapping("/final-payment")
    public ResponseEntity<?> chotHoaDon(@RequestBody PaymentDTO paymentDTO) {
        try {
            thanhToanService.xuLyThanhToan(paymentDTO);
            return ResponseEntity.ok("Thanh toán thành công và đã giải phóng bàn!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi thanh toán: " + e.getMessage());
        }
    }

}