package com.example.servicesalary.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // SecretKey phải đủ độ dài (ít nhất 32 ký tự cho HS256)
    private final SecretKey key = Keys.hmacShaKeyFor("12345678901234567890123456789012".getBytes());

    // 1. Tạo Token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)                 // Sửa .subject() thành .setSubject()
                .claim("role", role)                  // Hàm .claim() giữ nguyên
                .setIssuedAt(new Date(System.currentTimeMillis())) // Sửa .issuedAt() thành .setIssuedAt()
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24)) // Sửa .expiration() thành .setExpiration()
                .signWith(key)                        // Hàm .signWith() giữ nguyên
                .compact();
    }

    // 2. Kiểm tra Token có hợp lệ không (Dùng cho JwtFilter)
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // 3. Trích xuất Username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 4. Trích xuất Role
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // 5. Kiểm tra hết hạn
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // 6. Hàm dùng chung để trích xuất thông tin (Claims)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()       // Dùng parserBuilder() thay vì parser()
                .setSigningKey(key)       // Dùng setSigningKey() thay vì verifyWith()
                .build()
                .parseClaimsJws(token)    // Dùng parseClaimsJws()
                .getBody();               // Lấy Body thay vì Payload
    }
}