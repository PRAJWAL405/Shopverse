# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S marketplace && adduser -S marketplace -G marketplace
COPY --from=build /app/target/marketplace-backend-1.0.0.jar app.jar
RUN mkdir -p /app/uploads && chown -R marketplace:marketplace /app
USER marketplace
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]
