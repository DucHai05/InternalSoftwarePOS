package com.example.servicestore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "NguyenLieu")
@Data @NoArgsConstructor @AllArgsConstructor
public class NguyenLieu {
    @Id
    @Column(name = "maNguyenLieu", length = 20)
    private String maNguyenLieu;

    @Column(name = "tenNguyenLieu", columnDefinition = "NVARCHAR(100)")
    private String tenNguyenLieu;

    @Column(name = "soLuong")
    private Double soLuong;

    @Column(name = "donViTinh", columnDefinition = "NVARCHAR(20)")
    private String donViTinh;
}