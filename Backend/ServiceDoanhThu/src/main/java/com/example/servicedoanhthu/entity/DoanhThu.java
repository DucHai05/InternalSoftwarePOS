package com.example.servicedoanhthu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doanhthu")
public class DoanhThu {
    @Id
    @Column(name = "maDoanhThu", length = 50)
    private String maDoanhThu;

    @Column(name = "maCa", length = 50, nullable = false)
    private String maCa;

    @Column(name = "tienMat")
    private Double tienMat;

    @Column(name = "tienCK")
    private Double tienCK;

    @Column(name = "tienThu")
    private Double tienThu;

    @Column(name = "tienChi")
    private Double tienChi;

    public String getMaDoanhThu() {
        return maDoanhThu;
    }

    public void setMaDoanhThu(String maDoanhThu) {
        this.maDoanhThu = maDoanhThu;
    }

    public String getMaCa() {
        return maCa;
    }

    public void setMaCa(String maCa) {
        this.maCa = maCa;
    }

    public Double getTienMat() {
        return tienMat;
    }

    public void setTienMat(Double tienMat) {
        this.tienMat = tienMat;
    }

    public Double getTienCK() {
        return tienCK;
    }

    public void setTienCK(Double tienCK) {
        this.tienCK = tienCK;
    }

    public Double getTienThu() {
        return tienThu;
    }

    public void setTienThu(Double tienThu) {
        this.tienThu = tienThu;
    }

    public Double getTienChi() {
        return tienChi;
    }

    public void setTienChi(Double tienChi) {
        this.tienChi = tienChi;
    }
}
