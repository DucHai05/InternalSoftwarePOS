package com.example.servicecafe.dto;

import lombok.Data;

import java.util.List;

// PaymentDTO.java
@Data
public class PaymentDTO {
    private String maHoaDon;
    private String maBan;
    private List<OrderItemDTO> items;
    private String phuongThucThanhToan;
    private String maKhuyenMai;
    private Double tongTienSauKM;
    private String thoiGianThanhToan;
    private String trangThaiThanhToan;
    private String maCa;

    public String getMaCa() {return maCa;}

    public void setMaCa(String maCa) {this.maCa = maCa;}

    public String getMaBan() {
        return maBan;
    }

    public void setMaBan(String maBan) {
        this.maBan = maBan;
    }

    public List<OrderItemDTO> getItems() {return items;}
    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public String getMaKhuyenMai() {
        return maKhuyenMai;
    }

    public void setMaKhuyenMai(String maKhuyenMai) {
        this.maKhuyenMai = maKhuyenMai;
    }

    public Double getTongTienSauKM() {
        return tongTienSauKM;
    }

    public void setTongTienSauKM(Double tongTienSauKM) {
        this.tongTienSauKM = tongTienSauKM;
    }

    public String getThoiGianThanhToan() {
        return thoiGianThanhToan;
    }

    public void setThoiGianThanhToan(String thoiGianThanhToan) {
        this.thoiGianThanhToan = thoiGianThanhToan;
    }

    public String getTrangThaiThanhToan() {
        return trangThaiThanhToan;
    }

    public void setTrangThaiThanhToan(String trangThaiThanhToan) {
        this.trangThaiThanhToan = trangThaiThanhToan;
    }

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }
}