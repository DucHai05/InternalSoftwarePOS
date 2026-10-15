package com.example.servicetable.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả API
                .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*") // Chấp nhận mọi port từ localhost
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cho phép trình duyệt nhớ cấu hình này trong 1 giờ (giảm số lần gửi Preflight)
    }
}