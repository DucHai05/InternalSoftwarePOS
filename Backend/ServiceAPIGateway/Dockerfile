
# Dành cho Gateway
FROM eclipse-temurin:17-jre-alpine
# Chỉ dùng dấu sao đơn giản, bỏ qua ARG JAR_FILE
COPY build/libs/ServiceAPIGateway-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
# Giai đoạn 1: Sử dụng Gradle để build dự án từ mã nguồn
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Copy toàn bộ mã nguồn của service vào container
COPY . .

# Thực hiện lệnh build (bỏ qua chạy test để tiết kiệm thời gian)
RUN gradle build -x test --no-daemon

# Giai đoạn 2: Chạy ứng dụng với JRE nhẹ
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file .jar được sinh ra từ Giai đoạn 1 sang Giai đoạn 2
# Sử dụng wildcard *.jar để tự động lấy file bất kể phiên bản (SNAPSHOT hay Release)
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]

