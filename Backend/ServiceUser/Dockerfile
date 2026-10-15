
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Dùng tên chính xác hoặc dùng wildcard né chữ plain
COPY build/libs/*-SNAPSHOT.jar app.jar
# Giai đoạn 1: Build mã nguồn bằng Gradle
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Copy toàn bộ code của service vào container
COPY . .

# Thực hiện lệnh build, bỏ qua test để tiết kiệm thời gian và tài nguyên
RUN gradle build -x test --no-daemon

# Giai đoạn 2: Chạy ứng dụng với JRE nhẹ
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file .jar được sinh ra từ Giai đoạn 1 sang Giai đoạn 2
# Dùng wildcard để tự động lấy file có đuôi -SNAPSHOT.jar hoặc bất kỳ tên nào
COPY --from=build /app/build/libs/*.jar app.jar

# Service User thường chạy ở port 8086 (theo cấu hình Gateway của bạn)
EXPOSE 8086


ENTRYPOINT ["java", "-jar", "app.jar"]