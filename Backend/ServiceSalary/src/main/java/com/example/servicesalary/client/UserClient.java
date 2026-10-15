package com.example.servicesalary.client;

import com.example.servicesalary.config.FeignConfig;
import com.example.servicesalary.dto.NhanVienDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

// url trỏ về ServiceUser (8086). Nếu dùng Eureka sau này chỉ cần bỏ url, dùng name="service-user"
@FeignClient(name = "service-user",  configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("/nhan-vien")
    List<NhanVienDTO> getAllNhanVien(); // Không cần truyền tham số Token vào đây nữa
}