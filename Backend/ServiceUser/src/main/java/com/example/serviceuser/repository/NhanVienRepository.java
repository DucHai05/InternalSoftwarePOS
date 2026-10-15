package com.example.serviceuser.repository;

import com.example.serviceuser.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {


    @Query("SELECT MAX(n.maNhanVien) FROM NhanVien n WHERE n.maNhanVien LIKE :prefix")
    Optional<String> findMaxMaNhanVienByPrefix(@Param("prefix") String prefix);

    @Query("SELECT nv FROM NhanVien nv JOIN nv.taiKhoan tk WHERE tk.tenDangNhap = :username")
    Optional<NhanVien> findByUsernameFromAccount(@Param("username") String username);
    List<NhanVien> findByTrangThai(String trangThai);

    // 1. Lấy tên theo Mã nhân viên (Trả về String cho nhẹ)
    @Query("SELECT n.tenNhanVien FROM NhanVien n WHERE n.maNhanVien = :maNV")
    Optional<String> findTenByMa(@Param("maNV") String maNV);

    // 2. Lấy tên theo Username của tài khoản (Dùng cho thanh Sidebar/Profile)
    @Query("SELECT nv.tenNhanVien FROM NhanVien nv JOIN nv.taiKhoan tk WHERE tk.tenDangNhap = :username")
    Optional<String> findTenByUsername(@Param("username") String username);
}