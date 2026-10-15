package com.example.servicetable.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "khuvuc")
public class KhuVuc {
    @Id
    @Column(name = "maKhuVuc", length = 50)
    private String maKhuVuc;

    @Column(name = "tenKhuVuc", nullable = false)
    private String tenKhuVuc;

    @Column(name = "trangThai", nullable = false)
    private String trangThai;

    // Sử dụng @PrePersist để tự động gán giá trị trước khi INSERT
    @PrePersist
    public void prePersist() {
        if (this.trangThai == null) {
            this.trangThai = "Sẵn sàng";
        }
    }

    // Getters and Setters
    public String getMaKhuVuc() { return maKhuVuc; }
    public void setMaKhuVuc(String maKhuVuc) { this.maKhuVuc = maKhuVuc; }
    public String getTenKhuVuc() { return tenKhuVuc; }
    public void setTenKhuVuc(String tenKhuVuc) { this.tenKhuVuc = tenKhuVuc; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}