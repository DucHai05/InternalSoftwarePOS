package com.example.servicepromotion.dto;


import java.util.List;
import lombok.Data;

@Data // Hải dùng Lombok cho gọn nhé
public class KhuyenMaiDTO {
    private String maKhuyenMai;
    private String tenKhuyenMai;
    private String moTa;
    private String loaiKhuyenMai;
    private double giaTri;
    private boolean trangThai;
    private String mauSac;

    // Gửi kèm danh sách cấu hình của mã này
    private List<KhuyenMaiConfigDTO> configs;
}