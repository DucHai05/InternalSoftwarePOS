package com.example.servicedoanhthu.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDoanhThuDTO {
    // Số tiền thanh toán (Ví dụ: 150000.0)
    private Double amount;

    // Phương thức thanh toán (Ví dụ: "CASH" hoặc "TRANSFER")
    private String method;
}
