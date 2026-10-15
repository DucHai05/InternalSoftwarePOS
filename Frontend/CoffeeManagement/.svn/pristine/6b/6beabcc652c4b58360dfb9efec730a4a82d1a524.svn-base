# Giai đoạn 1: Build file JAR từ mã nguồn
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
# Build và bỏ qua chạy test để nhanh hơn
RUN gradle build -x test --no-daemon

# Giai đoạn 2: Chạy ứng dụng
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy file .jar từ giai đoạn build
COPY --from=build /app/build/libs/*.jar app.jar

# Eureka mặc định chạy ở port 8761
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]