package com.example.servicenotification.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ThongBao", schema = "dbo")
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maThongBao")
    private Integer maThongBao;

    @Column(name = "maNhanVien", length = 20, nullable = false)
    private String maNhanVien;

    @Column(name = "tieuDe", length = 255, nullable = false)
    private String tieuDe;

    @Column(name = "noiDung", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String noiDung;

    @Column(name = "loaiThongBao", length = 50, nullable = false)
    private String loaiThongBao;

    @Column(name = "idThamChieu", length = 50)
    private String idThamChieu;

    @Column(name = "daDoc")
    private Boolean daDoc = false;

    @Column(name = "ngayTao", insertable = false, updatable = false)
    private LocalDateTime ngayTao;

    // --- GETTERS & SETTERS ---

    public Integer getMaThongBao() { return maThongBao; }
    public void setMaThongBao(Integer maThongBao) { this.maThongBao = maThongBao; }

    public String getMaNhanVien() { return maNhanVien; }
    public void setMaNhanVien(String maNhanVien) { this.maNhanVien = maNhanVien; }

    public String getTieuDe() { return tieuDe; }
    public void setTieuDe(String tieuDe) { this.tieuDe = tieuDe; }

    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }

    public String getLoaiThongBao() { return loaiThongBao; }
    public void setLoaiThongBao(String loaiThongBao) { this.loaiThongBao = loaiThongBao; }

    public String getIdThamChieu() { return idThamChieu; }
    public void setIdThamChieu(String idThamChieu) { this.idThamChieu = idThamChieu; }

    public Boolean getDaDoc() { return daDoc; }
    public void setDaDoc(Boolean daDoc) { this.daDoc = daDoc; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}