package com.example.serviceuser;

import com.example.serviceuser.controller.AuthController;
import com.example.serviceuser.email.EmailService;
import com.example.serviceuser.entity.TaiKhoan;
import com.example.serviceuser.repository.TaiKhoanRepository;
import com.example.serviceuser.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ForgotPasswordTest {
    private final AuthService authService = mock(AuthService.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new AuthController(authService)).build();

    @Test
    void unknownEmailReturnsBadRequestWithReadableMessage() throws Exception {
        when(authService.sendOTP("missing@example.com")).thenThrow(new IllegalArgumentException("Email not found"));
        mvc.perform(post("/auth/forgot").contentType("application/json")
                        .content("{\"email\":\"missing@example.com\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("Email not found"));
    }

    @Test
    void smtpFailureReturnsServiceUnavailableWithoutServerDetails() throws Exception {
        when(authService.sendOTP("user@example.com")).thenThrow(new MailAuthenticationException("private SMTP details"));
        mvc.perform(post("/auth/forgot").contentType("application/json")
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("OTP_EMAIL_DELIVERY_FAILED"))
                .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("private SMTP details"))));
    }

    @Test
    void successfulDeliveryReturnsOk() throws Exception {
        when(authService.sendOTP("user@example.com")).thenReturn("OTP sent");
        mvc.perform(post("/auth/forgot").contentType("application/json")
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.message").value("OTP sent"));
    }

    @Test
    void databaseFailureIsNotReportedAsAnInvalidEmail() throws Exception {
        when(authService.sendOTP("user@example.com")).thenThrow(new RuntimeException("private database details"));
        mvc.perform(post("/auth/forgot").contentType("application/json")
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void whitespaceIsTrimmedBeforeLookingUpAccountAndSendingOtp() {
        TaiKhoanRepository repository = mock(TaiKhoanRepository.class);
        EmailService emailService = mock(EmailService.class);
        TaiKhoan account = new TaiKhoan();
        when(repository.findByTenDangNhap("user@example.com")).thenReturn(Optional.of(account));
        AuthService service = new AuthService(repository, null, null, null, null);
        ReflectionTestUtils.setField(service, "emailService", emailService);
        service.sendOTP(" user@example.com ");
        verify(repository).findByTenDangNhap("user@example.com");
        verify(emailService).sendOtp(eq("user@example.com"), matches("[1-9][0-9]{5}"));
        assertNotNull(account.getOTP());
    }

    @Test
    void invalidEmailDoesNotQueryDatabaseOrSendMail() {
        TaiKhoanRepository repository = mock(TaiKhoanRepository.class);
        AuthService service = new AuthService(repository, null, null, null, null);
        assertThrows(IllegalArgumentException.class, () -> service.sendOTP("admin"));
        assertThrows(IllegalArgumentException.class, () -> service.sendOTP(null));
        verifyNoInteractions(repository);
    }
}
