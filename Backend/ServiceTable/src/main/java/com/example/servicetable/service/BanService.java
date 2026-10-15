package com.example.servicetable.service;

import com.example.servicetable.dto.BanDTO;
import com.example.servicetable.entity.Ban;
import com.example.servicetable.entity.KhuVuc;
import com.example.servicetable.repository.BanRepository;
import com.example.servicetable.repository.KhuVucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BanService {
    private static final String MAINTENANCE_STATUS = "Bảo trì";

    @Autowired
    private BanRepository banRepository;

    @Autowired
    private KhuVucRepository khuVucRepository;

    public Ban getById(String maBan) {
        return banRepository.findById(maBan)
                .orElseThrow(() -> new RuntimeException("Khong tim thay ban voi ma: " + maBan));
    }

    public List<Ban> getByKhuVuc(String maKhuVuc) {
        return banRepository.findByKhuVucMaKhuVuc(maKhuVuc);
    }

    public List<Ban> getAll() {
        return banRepository.findByTrangThaiBanContaining("Hoạt động");
    }

    public List<Ban> getTable(String maBan) {
        return banRepository.findTrangThaiThanhToanContainingByMaBan(maBan);
    }

    public Ban create(BanDTO dto) {
        KhuVuc khuVuc = khuVucRepository.findById(dto.getMaKhuVuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khu Vực!"));

        Ban ban = new Ban();
        ban.setMaBan(generateMaBan(khuVuc.getMaKhuVuc()));
        ban.setTenBan(dto.getTenBan());
        ban.setTrangThaiBan(dto.getTrangThaiBan());
        ban.setKhuVuc(khuVuc);

        return banRepository.save(ban);
    }

    public Ban update(String id, BanDTO dto) {
        KhuVuc khuVuc = khuVucRepository.findById(dto.getMaKhuVuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khu Vực!"));

        Ban ban = banRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Bàn để cập nhật!"));

        ban.setTenBan(dto.getTenBan());
        ban.setTrangThaiBan(dto.getTrangThaiBan());
        ban.setKhuVuc(khuVuc);

        return banRepository.save(ban);
    }

    public void delete(String id) {
        Ban ban = banRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay ban voi ma: " + id));

        ban.setTrangThaiBan(MAINTENANCE_STATUS);
        banRepository.save(ban);
    }

    public void updateTrangThaiBan(String maBan, String status) {
        banRepository.findById(maBan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn: " + maBan));

        banRepository.updateTrangThaiThanhToan(maBan, status);
    }

    private String generateMaBan(String maKhuVuc) {

        // TANG1 -> BAN101, BAN102...
        if (maKhuVuc.matches("TANG\\d+")) {

            int tang = Integer.parseInt(maKhuVuc.replace("TANG", ""));

            List<Ban> dsBan = banRepository.findByKhuVucMaKhuVuc(maKhuVuc);

            int maxStt = dsBan.stream()
                    .map(Ban::getMaBan)
                    .filter(ma -> ma.matches("BAN\\d{3}"))
                    .mapToInt(ma -> Integer.parseInt(ma.substring(3)))
                    .max()
                    .orElse(tang * 100);

            return "BAN" + (maxStt + 1);
        }

        // SANH -> SANH01, SANH02...
        List<Ban> dsBan = banRepository.findByKhuVucMaKhuVuc(maKhuVuc);

        int maxStt = dsBan.stream()
                .map(Ban::getMaBan)
                .filter(ma -> ma.startsWith(maKhuVuc))
                .map(ma -> ma.substring(maKhuVuc.length()))
                .mapToInt(this::parseSequence)
                .max()
                .orElse(0);

        return maKhuVuc + String.format("%02d", maxStt + 1);
    }

    private int parseSequence(String sequence) {
        try {
            return Integer.parseInt(sequence);
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Mã bàn hiện tại không đúng định dạng số thứ tự");
        }
    }
}
