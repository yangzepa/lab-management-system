package com.lab.management.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Lab Management API",
                version = "1.0",
                description = "REST API for Laboratory Management System",
                contact = @Contact(
                        name = "Yang Ze-pa",
                        email = "yangzepa@sch.ac.kr",
                        url = "http://yangzepa.com"
                )
        ),
        servers = {
                @Server(url = "http://localhost:8080/api", description = "Local Development Server"),
                @Server(url = "https://yourdomain.com/api", description = "Production Server")
        }
)
@SecurityScheme(
        name = "bearer-jwt",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
