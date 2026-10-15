package com.example.servicepromotion.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "KhuyenMaiConfig")
public class KhuyenMaiConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_config")
    private Long idConfig;

    @ManyToOne
    @JoinColumn(name = "ma_khuyen_mai")
    @JsonBackReference
    private KhuyenMai khuyenMai;

    @Column(name = "loai_doi_tuong")
    private String loaiDoiTuong; // STAFF, VIP...

    @Column(name = "gia_tri_don_toitheu")
    private double giaTriDonToiThieu;

    @Column(name = "ap_dung_cho_mon")
    private String apDungChoMon; // ALL, CAFE, TEA...

    public Long getIdConfig() {
        return idConfig;
    }

    public void setIdConfig(Long idConfig) {
        this.idConfig = idConfig;
    }

    public KhuyenMai getKhuyenMai() {
        return khuyenMai;
    }

    public void setKhuyenMai(KhuyenMai khuyenMai) {
        this.khuyenMai = khuyenMai;
    }

    public String getLoaiDoiTuong() {
        return loaiDoiTuong;
    }

    public void setLoaiDoiTuong(String loaiDoiTuong) {
        this.loaiDoiTuong = loaiDoiTuong;
    }

    public double getGiaTriDonToiThieu() {
        return giaTriDonToiThieu;
    }

    public void setGiaTriDonToiThieu(double giaTriDonToiThieu) {
        this.giaTriDonToiThieu = giaTriDonToiThieu;
    }

    public String getApDungChoMon() {
        return apDungChoMon;
    }

    public void setApDungChoMon(String apDungChoMon) {
        this.apDungChoMon = apDungChoMon;
    }
}
