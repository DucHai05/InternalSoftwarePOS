package com.example.servicedoanhthu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ca")
public class Ca {
    @Id
    @Column(name = "maCa", length = 50)
    private String maCa;

    @Column(name = "tenCa", nullable = false)
    private String tenCa;

    @Column(name = "ngayThang", nullable = false)
    private LocalDate ngayThang;

    @Column(name = "gioMoCa")
    private LocalTime gioMoCa;

    @Column(name = "gioDongCa")
    private LocalTime gioDongCa;

    @Column(name = "trangThai", nullable = false)
    private String trangThai;

    @Column(name = "soTienKet")
    private Double soTienKet;

    @Column(name = "maNhanVien", length = 50, nullable = false)
    private String maNhanVien;

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public String getTenCa() {
        return tenCa;
    }

    public void setTenCa(String tenCa) {
        this.tenCa = tenCa;
    }

    public LocalDate getNgayThang() {
        return ngayThang;
    }

    public void setNgayThang(LocalDate ngayThang) {
        this.ngayThang = ngayThang;
    }

    public LocalTime getGioMoCa() {
        return gioMoCa;
    }

    public void setGioMoCa(LocalTime gioMoCa) {
        this.gioMoCa = gioMoCa;
    }

    public LocalTime getGioDongCa() {
        return gioDongCa;
    }

    public void setGioDongCa(LocalTime gioDongCa) {
        this.gioDongCa = gioDongCa;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public Double getSoTienKet() {
        return soTienKet;
    }

    public void setSoTienKet(Double soTienKet) {
        this.soTienKet = soTienKet;
    }

    public String getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(String maNhanVien) {
        this.maNhanVien = maNhanVien;
    }
}
