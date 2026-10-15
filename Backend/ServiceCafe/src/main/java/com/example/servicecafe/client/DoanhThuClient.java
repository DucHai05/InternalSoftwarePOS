package com.example.servicecafe.client;

import com.example.servicecafe.dto.UpdateDoanhThuDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "SERVICE-DOANH-THU", path = "/doanhthu")
public interface DoanhThuClient {
    @PutMapping("/update-after-payment/{maCa}")
    void updateRevenueAfterPayment(@PathVariable("maCa") String maCa, @RequestBody UpdateDoanhThuDTO dto);
}
