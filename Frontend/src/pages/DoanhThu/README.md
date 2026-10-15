# Quản Lý Doanh Thu

## Tổng quan

Module Quản Lý Doanh Thu hiển thị danh sách doanh thu theo dạng thẻ với các thông tin chi tiết về từng ca làm việc.

## Tính năng

### 📊 Danh sách doanh thu
- **Thẻ doanh thu**: Hiển thị thông tin tổng quan của từng ca
- **Thông tin hiển thị**:
  - Mã doanh thu
  - Mã ca và tên ca
  - Giờ mở và giờ đóng ca
  - Tổng doanh thu (tiền mặt + chuyển khoản)
  - Trạng thái ca (đang mở/đã đóng)

### 📈 Thống kê tổng quan
- Tổng số ca
- Tổng doanh thu toàn hệ thống
- Số ca đã đóng

### 🔍 Chi tiết doanh thu
Khi click vào thẻ doanh thu, hiển thị:
- **Thông tin ca**: mã ca, tên ca, nhân viên, ngày, giờ mở/đóng
- **Tổng hợp doanh thu**: tiền mặt, chuyển khoản, thu, chi, tiền két
- **Danh sách sản phẩm**: các sản phẩm đã bán trong ca
- **Danh sách hóa đơn**: các hóa đơn trong ca

## Giao diện

### Danh sách thẻ doanh thu
- Grid layout responsive
- Hover effects và animations
- Màu sắc phân biệt trạng thái ca
- Thống kê tổng quan ở đầu trang

### Chi tiết doanh thu
- Layout tương tự CaDetail nhưng chỉ đọc
- Tất cả nút bị disable
- Hiển thị đầy đủ thông tin doanh thu

## API Endpoints

- `GET /api/doanhthu` - Lấy danh sách doanh thu
- `GET /api/ca` - Lấy danh sách ca (để map thông tin)
- `GET /api/hoadon` - Lấy hóa đơn trong ca
- `GET /api/ban` - Lấy thông tin bàn

## Cách sử dụng

1. **Truy cập**: Chọn "Quản Lý Doanh Thu" trong menu
2. **Xem danh sách**: Xem các thẻ doanh thu với thông tin tổng quan
3. **Xem chi tiết**: Click vào thẻ để xem chi tiết doanh thu của ca
4. **Làm mới**: Sử dụng nút "🔄 Làm mới" để cập nhật dữ liệu

## Lưu ý kỹ thuật

- Component tự động fetch dữ liệu khi mount
- Xử lý lỗi và loading states
- Responsive design cho mobile và desktop
- Tất cả dữ liệu chỉ đọc, không có chức năng chỉnh sửa