package com.example.servicestore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient // <-- PHẢI CÓ DÒNG NÀY
public class ServiceStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceStoreApplication.class, args);
    }

}
