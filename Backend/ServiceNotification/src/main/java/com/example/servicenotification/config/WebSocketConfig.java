package com.example.servicenotification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Mở endpoint cho React kết nối tới
        registry.addEndpoint("/ws-notifications")
                .setAllowedOriginPatterns("*") // Chống lỗi CORS khi gọi từ Frontend
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Kênh để Server đẩy tin nhắn xuống Client
        registry.enableSimpleBroker("/topic");
        
        // Kênh để Client gửi tin nhắn lên Server (nếu cần dùng sau này)
        registry.setApplicationDestinationPrefixes("/app");
    }
}