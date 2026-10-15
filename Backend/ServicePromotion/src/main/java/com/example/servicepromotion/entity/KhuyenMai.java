package com.example.servicepromotion.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "KhuyenMai")
public class KhuyenMai {

    @Id
    @Column(name = "ma_khuyen_mai", length = 20)
    private String maKhuyenMai;

    @Column(name = "ten_khuyen_mai", columnDefinition = "nvarchar(100)")
    private String tenKhuyenMai;

    @Column(name = "mo_ta", columnDefinition = "nvarchar(255)")
    private String moTa;

    @Column(name = "loai_khuyen_mai")
    private String loaiKhuyenMai;

    @Column(name = "gia_tri")
    private double giaTri;

    @Column(name = "trang_thai")
    private boolean trangThai;

    @Column(name = "mau_sac")
    private String mauSac;

    // Liên kết với bảng Config (Một khuyến mãi có thể có nhiều cấu hình)
    @OneToMany(mappedBy = "khuyenMai", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<KhuyenMaiConfig> configs;

    public String getMaKhuyenMai() {
        return maKhuyenMai;
    }

    public void setMaKhuyenMai(String maKhuyenMai) {
        this.maKhuyenMai = maKhuyenMai;
    }

    public String getTenKhuyenMai() {
        return tenKhuyenMai;
    }

    public void setTenKhuyenMai(String tenKhuyenMai) {
        this.tenKhuyenMai = tenKhuyenMai;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getLoaiKhuyenMai() {
        return loaiKhuyenMai;
    }

    public void setLoaiKhuyenMai(String loaiKhuyenMai) {
        this.loaiKhuyenMai = loaiKhuyenMai;
    }

    public double getGiaTri() {
        return giaTri;
    }

    public void setGiaTri(double giaTri) {
        this.giaTri = giaTri;
    }

    public boolean isTrangThai() {
        return trangThai;
    }

    public void setTrangThai(boolean trangThai) {
        this.trangThai = trangThai;
    }

    public String getMauSac() {
        return mauSac;
    }

    public void setMauSac(String mauSac) {
        this.mauSac = mauSac;
    }

    public List<KhuyenMaiConfig> getConfigs() {
        return configs;
    }

    public void setConfigs(List<KhuyenMaiConfig> configs) {
        this.configs = configs;
    }
}