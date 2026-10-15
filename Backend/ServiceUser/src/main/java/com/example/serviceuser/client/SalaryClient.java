package com.example.serviceuser.client;

import com.example.serviceuser.config.FeignAuthForwardConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "service-salary", configuration = FeignAuthForwardConfig.class)
public interface SalaryClient {
    // Gọi endpoint kiểm tra xem NV có bảng lương/chấm công chưa
    @GetMapping("/api/salary/check-history/{maNV}")
    boolean hasHistory(@PathVariable("maNV") String maNV);
}
