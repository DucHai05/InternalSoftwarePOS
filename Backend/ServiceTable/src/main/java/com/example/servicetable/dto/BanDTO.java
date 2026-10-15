package com.example.servicetable.dto;

public class BanDTO {
    private String maBan;
    private String tenBan;
    private String trangThaiBan;
    private String maKhuVuc; // Chỉ cần nhận mã khu vực từ client

    // Getters and Setters
    public String getMaBan() { return maBan; }
    public void setMaBan(String maBan) { this.maBan = maBan; }
    public String getTenBan() { return tenBan; }
    public void setTenBan(String tenBan) { this.tenBan = tenBan; }
    public String getTrangThaiBan() { return trangThaiBan; }
    public void setTrangThaiBan(String trangThaiBan) { this.trangThaiBan = trangThaiBan; }
    public String getMaKhuVuc() { return maKhuVuc; }
    public void setMaKhuVuc(String maKhuVuc) { this.maKhuVuc = maKhuVuc; }
}
