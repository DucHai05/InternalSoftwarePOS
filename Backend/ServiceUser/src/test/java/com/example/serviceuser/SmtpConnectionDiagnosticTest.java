package com.example.serviceuser;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.io.InputStream;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.fail;

// Explicitly enabled diagnostics authenticate with SMTP but never send an email.
@EnabledIfEnvironmentVariable(named = "CHECK_SMTP_CONNECTION", matches = "true")
class SmtpConnectionDiagnosticTest {
    @Test
    void configuredSmtpConnectionCanAuthenticate() throws Exception {
        Properties properties = new Properties();
        try (InputStream source = getClass().getResourceAsStream("/application.properties")) {
            properties.load(source);
        }
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(properties.getProperty("spring.mail.host"));
        sender.setPort(Integer.parseInt(properties.getProperty("spring.mail.port")));
        sender.setUsername(properties.getProperty("spring.mail.username"));
        sender.setPassword(properties.getProperty("spring.mail.password"));
        String prefix = "spring.mail.properties.";
        properties.stringPropertyNames().stream().filter(key -> key.startsWith(prefix))
                .forEach(key -> sender.getJavaMailProperties().setProperty(key.substring(prefix.length()), properties.getProperty(key)));
        try {
            sender.testConnection();
        } catch (Exception e) {
            fail("SMTP_CONNECTION_FAILED: " + e.getClass().getSimpleName());
        }
    }
}
