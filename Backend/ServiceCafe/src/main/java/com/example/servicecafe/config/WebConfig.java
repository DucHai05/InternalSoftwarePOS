package com.example.servicecafe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Tất cả các đường dẫn API
                        .allowedOrigins("http://localhost:5173") // Chỉ đích danh React của Hải
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Quan trọng là có OPTIONS
                        .allowedHeaders("*") // Cho phép tất cả các loại Header (JSON, Auth...)
                        .allowCredentials(true)
                        .maxAge(3600); // Lưu kết quả thăm dò trong 1 tiếng để lần sau không phải hỏi lại
            }
        };
    }
}