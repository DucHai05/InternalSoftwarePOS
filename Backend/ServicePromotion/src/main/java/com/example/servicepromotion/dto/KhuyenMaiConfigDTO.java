package com.example.servicepromotion.dto;

import lombok.Data;

@Data
public class KhuyenMaiConfigDTO {
    private Long idConfig;           // Cần ID để tìm trong DB
    private String loaiDoiTuong;     // ALL, SELECTIVE...
    private double giaTriDonToiThieu;
    private String apDungChoMon;     // Đã sửa từ ap_dung_cho_mon

    // Hai trường này để React gửi dữ liệu đơn hàng lên check
    private double totalAmount;
    private boolean hasCafe;
}