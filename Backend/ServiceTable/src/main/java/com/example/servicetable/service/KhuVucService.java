package com.example.servicetable.service;

import com.example.servicetable.entity.Ban;
import com.example.servicetable.entity.KhuVuc;
import com.example.servicetable.repository.BanRepository;
import com.example.servicetable.repository.KhuVucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KhuVucService {
    @Autowired
    private KhuVucRepository repository;

    @Autowired
    private BanRepository banRepository;

    public List<KhuVuc> getAll() {
        return repository.findAll();
    }

    public KhuVuc createNew(KhuVuc khuVuc) {
        if (repository.existsById(khuVuc.getMaKhuVuc())) {
            throw new RuntimeException("Ma khu vuc nay da ton tai!");
        }
        return repository.save(khuVuc);
    }

    @Transactional
    public KhuVuc update(KhuVuc khuVuc) {
        KhuVuc savedKhuVuc = repository.save(khuVuc);

        if (requiresMaintenance(savedKhuVuc.getTrangThai())) {
            List<Ban> bans = banRepository.findByKhuVucMaKhuVuc(savedKhuVuc.getMaKhuVuc());
            for (Ban ban : bans) {
                ban.setTrangThaiBan("Bảo trì");
            }
            banRepository.saveAll(bans);
        }

        return savedKhuVuc;
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    private boolean requiresMaintenance(String trangThai) {
        return "Bảo trì".equalsIgnoreCase(trangThai) || "Tạm ngưng".equalsIgnoreCase(trangThai);
    }
}
