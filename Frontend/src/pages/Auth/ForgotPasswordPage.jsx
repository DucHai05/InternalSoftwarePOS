import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot.css";
// IMPORT FILE API TỔNG HỢP
import { authApi } from '../../api/APIGateway';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const showError = (error, fallback) => {
        const data = error.response?.data;
        setErrorMessage(data?.message || data?.error ||
            (typeof data === "string" ? data : "") ||
            (error.code === "ECONNABORTED" ? "Máy chủ phản hồi quá lâu. Vui lòng thử lại." : fallback));
    };

    // Bước 1: Gửi yêu cầu OTP qua Gateway
    const handleSendOTP = async () => {
        if (busy) return;
        const normalizedEmail = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setErrorMessage("Vui lòng nhập email hợp lệ!");
            return;
        }
        setEmail(normalizedEmail);
        setBusy(true);
        setErrorMessage("");
        try {
            // Sử dụng authApi.forgot thay vì fetch thủ công
            const res = await authApi.forgotPassword(normalizedEmail);
            if (res.status === 200) {
                alert("Mã OTP đã được gửi đến email của bạn.");
                setStep(2);
            }
        } catch (error) {
            showError(error, "Không thể gửi OTP. Vui lòng kiểm tra kết nối máy chủ.");
        } finally {
            setBusy(false);
        }
    };

    // Bước 2: Xác thực OTP qua Gateway
    const handleVerifyOTP = async () => {
        if (busy) return;
        if (!/^\d{6}$/.test(otp)) return setErrorMessage("Mã OTP phải gồm đúng 6 chữ số!");
        setBusy(true);
        setErrorMessage("");
        try {
            // Sử dụng authApi.verifyOtp
            const res = await authApi.verifyOTP(email, parseInt(otp));
            if (res.status === 200) {
                setStep(3);
            }
        } catch (error) {
            showError(error, "Không thể xác thực OTP. Vui lòng thử lại.");
        } finally {
            setBusy(false);
        }
    };

    // Bước 3: Đổi mật khẩu mới qua Gateway
    const handleResetPassword = async () => {
        if (busy) return;
        if (password !== confirm) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setBusy(true);
        setErrorMessage("");
        try {
            // Sử dụng authApi.resetPassword
            const res = await authApi.resetPassword(email, parseInt(otp), password);
            if (res.status === 200) {
                alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                navigate("/");
            }
        } catch (error) {
            showError(error, "Lỗi reset mật khẩu, vui lòng thử lại!");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="portal-container">
            {/* BÊN TRÁI - Hero Section (Giữ nguyên giao diện đẹp của bạn) */}
            <div className="portal-hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <span className="brand-label">LADO COFFEE SYSTEM</span>
                        <div className="hero-title-wrapper">
                            <h1 className="hero-title">Khôi phục</h1>
                            <h1 className="hero-title highlight">mật khẩu hệ thống</h1>
                        </div>
                        <p className="hero-description">
                            Đừng lo lắng, hãy làm theo các bước xác thực để bảo vệ <br/>
                            tài khoản quản trị của bạn một cách an toàn nhất.
                        </p>
                    </div>
                    <div className="hero-footer">
                        <span>© 2024 Lado Coffee Portal</span>
                        <span>Hỗ trợ: 1900 xxxx</span>
                    </div>
                </div>
            </div>

            {/* BÊN PHẢI - Form xác thực 3 bước */}
            <div className="portal-form-section">
                <div className="top-right-logo">
                    <img src="/lg_lado.png" alt="Lado Logo" />
                </div>

                <div className="form-wrapper">
                    <div className="welcome-text-group">
                        <h2 className="form-welcome">Quên mật khẩu?</h2>
                        <p className="form-subtitle">
                            {step === 1 && "Bước 1: Nhập email đăng ký của bạn"}
                            {step === 2 && "Bước 2: Nhập mã OTP đã được gửi"}
                            {step === 3 && "Bước 3: Thiết lập lại mật khẩu mới"}
                        </p>
                    </div>

                    <div className="forgot-content-box">
                        {errorMessage && <p className="forgot-error" role="alert">{errorMessage}</p>}
                        {step === 1 && (
                            <div className="input-field">
                                <label>Email khôi phục</label>
                                <div className="input-icon-wrapper">
                                    <span className="input-icon">✉️</span>
                                    <input
                                        type="email"
                                        placeholder="Nhập Gmail đăng ký của bạn"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button className="btn-portal-submit" disabled={busy} onClick={handleSendOTP}>{busy ? "ĐANG GỬI OTP..." : "GỬI MÃ OTP"}</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="input-field">
                                <label>Mã xác thực OTP</label>
                                <div className="input-icon-wrapper">
                                    <span className="input-icon">🔑</span>
                                    <input
                                        type="text"
                                        placeholder="6 chữ số"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <button className="btn-portal-submit" disabled={busy} onClick={handleVerifyOTP}>{busy ? "ĐANG XÁC THỰC..." : "XÁC NHẬN MÃ"}</button>
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div className="input-field">
                                    <label>Mật khẩu mới</label>
                                    <div className="input-icon-wrapper">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu mới"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? "👁️" : "🙈"}
                                        </span>
                                    </div>
                                </div>
                                <div className="input-field">
                                    <label>Xác nhận lại mật khẩu</label>
                                    <div className="input-icon-wrapper">
                                        <span className="input-icon">✔️</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nhập lại mật khẩu"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="btn-portal-submit" disabled={busy} onClick={handleResetPassword}>{busy ? "ĐANG LƯU..." : "LƯU MẬT KHẨU"}</button>
                            </>
                        )}
                    </div>

                    <div className="form-footer-actions">
                        <button className="btn-outline-full" onClick={() => navigate("/")}>
                            QUAY LẠI ĐĂNG NHẬP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
