package com.example.servicenotification.service;

import com.example.servicenotification.entity.ThongBao;
import com.example.servicenotification.repository.ThongBaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThongBaoService {

    @Autowired
    private ThongBaoRepository thongBaoRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ThongBao taoThongBao(ThongBao thongBao) {
        // 1. Mặc định gán trạng thái chưa đọc và thời gian hiện tại trước khi lưu
        thongBao.setDaDoc(false);
        thongBao.setNgayTao(LocalDateTime.now());
        
        // 2. Lưu vào CSDL
        ThongBao savedThongBao = thongBaoRepository.save(thongBao);

        // 3. Đẩy thông báo qua WebSocket tới đích đến cụ thể (Dựa vào maNhanVien)
        String destination = "/topic/notifications/" + savedThongBao.getMaNhanVien();
        messagingTemplate.convertAndSend(destination, savedThongBao);

        return savedThongBao;
    }

    public long demThongBaoChuaDoc(String maNhanVien) {
        return thongBaoRepository.countByMaNhanVienAndDaDocFalse(maNhanVien);
    }

    public List<ThongBao> layDanhSachThongBao(String maNhanVien) {
        return thongBaoRepository.findByMaNhanVienOrderByNgayTaoDesc(maNhanVien);
    }

    public void danhDauDaDoc(Integer maThongBao) {
        thongBaoRepository.findById(maThongBao).ifPresent(tb -> {
            tb.setDaDoc(true);
            thongBaoRepository.save(tb);
        });
    }
}