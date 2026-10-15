package com.example.servicesalary.client;

import com.example.servicesalary.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

// Tên name phải khớp với spring.application.name của Service Thông báo
@FeignClient(name = "service-notification", configuration = FeignConfig.class)
public interface NotificationClient {

    @PostMapping("/notifications/create")
    void send(@RequestBody Map<String, Object> body);
}