package com.example.servicepromotion.service;

import com.example.servicepromotion.dto.KhuyenMaiConfigDTO;
import com.example.servicepromotion.dto.KhuyenMaiDTO;
import com.example.servicepromotion.entity.KhuyenMai;
import com.example.servicepromotion.entity.KhuyenMaiConfig;
import com.example.servicepromotion.repository.KhuyenMaiConfigRepository;
import com.example.servicepromotion.repository.KhuyenMaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KhuyenMaiService {

    @Autowired
    private KhuyenMaiRepository kmRepo;

    @Autowired
    private KhuyenMaiConfigRepository configRepo;

    // 1. LẤY TẤT CẢ
    public List<KhuyenMaiDTO> getAllPromotions() {
        return kmRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 2. LẤY MÃ ĐANG BẬT
    public List<KhuyenMaiDTO> getActivePromotions() {
        return kmRepo.findByTrangThaiTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 3. THÊM MỚI

    @Transactional
    public void savePromotion(KhuyenMaiDTO dto) {
        KhuyenMai km = new KhuyenMai();


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);

        // 2. Tạo mã KM: KM + chuỗi thời gian
        String maKhuyenMai = "KM" + timestamp;

        // Gán vào entity
        km.setMaKhuyenMai(maKhuyenMai);

        mapDtoToEntity(dto, km);

        KhuyenMai savedKM = kmRepo.save(km);
        saveConfigs(dto, savedKM);
    }

    // 4. CẬP NHẬT (Hàm mới bổ sung cho Controller)
    @Transactional
    public void updatePromotion(String id, KhuyenMaiDTO dto) {
        KhuyenMai existingKM = kmRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã khuyến mãi: " + id));

        // Cập nhật thông tin cơ bản
        mapDtoToEntity(dto, existingKM);
        KhuyenMai savedKM = kmRepo.save(existingKM);

        // Xử lý Config: Xóa sạch config cũ của mã này và nạp lại từ DTO mới
        configRepo.deleteByKhuyenMai(savedKM);
        saveConfigs(dto, savedKM);
    }

    // 5. BẬT/TẮT NHANH
    @Transactional
    public void toggleStatus(String id) {
        KhuyenMai km = kmRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mã không tồn tại"));
        km.setTrangThai(!km.isTrangThai());
        kmRepo.save(km);
    }

    // 6. XÓA
    @Transactional
    public void deletePromotion(String id) {
        kmRepo.deleteById(id);
    }

    // --- CÁC HÀM BỔ TRỢ (HELPER METHODS) ---

    private void mapDtoToEntity(KhuyenMaiDTO dto, KhuyenMai entity) {
        entity.setTenKhuyenMai(dto.getTenKhuyenMai());
        entity.setMoTa(dto.getMoTa());
        entity.setLoaiKhuyenMai(dto.getLoaiKhuyenMai());
        entity.setGiaTri(dto.getGiaTri());
        entity.setTrangThai(dto.isTrangThai());
        entity.setMauSac(dto.getMauSac());
    }

    private void saveConfigs(KhuyenMaiDTO dto, KhuyenMai km) {
        if (dto.getConfigs() != null && !dto.getConfigs().isEmpty()) {
            for (KhuyenMaiConfigDTO cDto : dto.getConfigs()) {
                KhuyenMaiConfig config = new KhuyenMaiConfig();
                config.setKhuyenMai(km);
                config.setLoaiDoiTuong(cDto.getLoaiDoiTuong());
                config.setGiaTriDonToiThieu(cDto.getGiaTriDonToiThieu());
                config.setApDungChoMon(cDto.getApDungChoMon());
                configRepo.save(config);
            }
        }
    }

    private KhuyenMaiDTO convertToDTO(KhuyenMai km) {
        KhuyenMaiDTO dto = new KhuyenMaiDTO();
        dto.setMaKhuyenMai(km.getMaKhuyenMai());
        dto.setTenKhuyenMai(km.getTenKhuyenMai());
        dto.setMoTa(km.getMoTa());
        dto.setLoaiKhuyenMai(km.getLoaiKhuyenMai());
        dto.setGiaTri(km.getGiaTri());
        dto.setTrangThai(km.isTrangThai());
        dto.setMauSac(km.getMauSac());

        if (km.getConfigs() != null) {
            dto.setConfigs(km.getConfigs().stream().map(c -> {
                KhuyenMaiConfigDTO cDto = new KhuyenMaiConfigDTO();
                cDto.setLoaiDoiTuong(c.getLoaiDoiTuong());
                cDto.setGiaTriDonToiThieu(c.getGiaTriDonToiThieu());
                cDto.setApDungChoMon(c.getApDungChoMon());
                return cDto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}