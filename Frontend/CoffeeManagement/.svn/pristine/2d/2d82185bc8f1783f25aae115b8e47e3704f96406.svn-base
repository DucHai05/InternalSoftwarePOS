FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Dùng tên chính xác hoặc dùng wildcard né chữ plain
COPY build/libs/*-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]