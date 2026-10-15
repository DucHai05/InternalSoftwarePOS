package com.example.servicesalary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients // Kích hoạt tính năng Feign
@EnableDiscoveryClient // <-- PHẢI CÓ DÒNG NÀY
public class ServiceSalaryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceSalaryApplication.class, args);
    }

}
