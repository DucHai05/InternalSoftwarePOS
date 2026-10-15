package com.example.servicedoanhthu.service;

import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.repository.CaRepository;
import com.example.servicedoanhthu.repository.DoanhThuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoanhThuService {
    @Autowired
    private DoanhThuRepository doanhThuRepository;

    @Autowired
    private CaRepository caRepository;

    public List<DoanhThu> getAll() {
        return doanhThuRepository.findAll();
    }

    public DoanhThu getById(String maDoanhThu) {
        return doanhThuRepository.findById(maDoanhThu)
                .orElseThrow(() -> new RuntimeException("Khong tim thay doanh thu voi ma: " + maDoanhThu));
    }

    public DoanhThu getByMaCa(String maCa) {
        return doanhThuRepository.findByMaCa(maCa)
                .orElseThrow(() -> new RuntimeException("Khong tim thay doanh thu cho ca: " + maCa));
    }

    @Transactional
    public DoanhThu updateRevenueAfterPayment(String maCa, Double amount, String method) {
        if (amount == null || amount < 0) {
            throw new RuntimeException("So tien thanh toan khong hop le");
        }

        DoanhThu doanhThu = doanhThuRepository.findByMaCa(maCa)
                .orElseGet(() -> {
                    DoanhThu newDt = new DoanhThu();
                    newDt.setMaDoanhThu("DT-" + maCa);
                    newDt.setMaCa(maCa);
                    newDt.setTienMat(0.0);
                    newDt.setTienCK(0.0);
                    newDt.setTienThu(0.0);
                    newDt.setTienChi(0.0);
                    return newDt;
                });

        String normalizedMethod = method == null ? "" : method.trim().toUpperCase();

        if ("CASH".equals(normalizedMethod)
                || "TIEN_MAT".equals(normalizedMethod)
                || "TIEN MAT".equals(normalizedMethod)) {
            Double currentMat = doanhThu.getTienMat() != null ? doanhThu.getTienMat() : 0.0;
            doanhThu.setTienMat(currentMat + amount);

            int updatedRows = caRepository.incrementSoTienKetByMaCa(maCa, amount);
            if (updatedRows == 0) {
                throw new RuntimeException("Khong tim thay ca voi ma: " + maCa);
            }
        } else if ("TRANSFER".equals(normalizedMethod)
                || "CHUYEN_KHOAN".equals(normalizedMethod)
                || "CHUYEN KHOAN".equals(normalizedMethod)) {
            Double currentCK = doanhThu.getTienCK() != null ? doanhThu.getTienCK() : 0.0;
            doanhThu.setTienCK(currentCK + amount);
        } else {
            throw new RuntimeException("Phuong thuc thanh toan khong hop le: " + method);
        }

        return doanhThuRepository.save(doanhThu);
    }
}
