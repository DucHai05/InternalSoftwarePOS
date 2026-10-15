package com.example.servicedoanhthu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "phieuthuchi")
public class PhieuThuChi {
    @Id
    @Column(name = "maPhieu", length = 50)
    private String maPhieu;

    @Column(name = "maCa", length = 50, nullable = false)
    private String maCa;

    @Column(name = "soTien")
    private Double soTien;

    @Column(name = "ghiChu")
    private String ghiChu;

    @Column(name = "loaiPhieu", nullable = false)
    private String loaiPhieu;

    public String getMaPhieu() {
        return maPhieu;
    }

    public void setMaPhieu(String maPhieu) {
        this.maPhieu = maPhieu;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public Double getSoTien() {
        return soTien;
    }

    public void setSoTien(Double soTien) {
        this.soTien = soTien;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public String getLoaiPhieu() {
        return loaiPhieu;
    }

    public void setLoaiPhieu(String loaiPhieu) {
        this.loaiPhieu = loaiPhieu;
    }
}
