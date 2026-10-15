package com.example.serviceproduct.dto.response;

import com.example.serviceproduct.entity.CongThuc;

import lombok.Data;
import java.util.List; 
@Data
public class SanPhamResponse {
    private String maSanPham;
    private String tenSanPham;
    private Double donGia;
    private String duongDanHinh;
    private String trangThai;
    private String maLoaiSanPham;
    private String tenLoaiSanPham;
    private List<CongThuc> danhSachCongThuc;
}