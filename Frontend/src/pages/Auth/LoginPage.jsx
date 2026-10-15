import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import authApi và saveToken từ file gateway của bạn
import { authApi, saveToken } from "../../api/APIGateway"; 
import "./login.css";

function Login() {
    const [tenDangNhap, setTenDangNhap] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (isLoggingIn) return;
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!tenDangNhap || !matKhau) {
            alert("Vui lòng nhập tài khoản và mật khẩu!");
            return;
        }

        setIsLoggingIn(true);
        setErrorMessage("");
        try {
            // Sử dụng authApi từ Gateway (Cổng 8080)
            const res = await authApi.login({ tenDangNhap, matKhau });
            
            if (res.data && res.data.token) {
                // Lưu token bằng hàm helper từ gateway
                saveToken(res.data.token);
                
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem("tenNhanVien", res.data.tenNhanVien);
                localStorage.setItem('maNhanVien', res.data.maNhanVien);
                localStorage.setItem("role", res.data.role);
                
                // Điều hướng đến dashboard
                navigate("/dashboard");
            } else {
                setErrorMessage("Máy chủ không trả về phiên đăng nhập hợp lệ.");
            }
        } catch (error) {
            // Bắt lỗi từ Axios (thường là 401 Unauthorized nếu sai pass)
            console.error("Lỗi đăng nhập:", error);
            if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
                setErrorMessage("Máy chủ phản hồi quá lâu. Vui lòng thử lại.");
            } else if (!error.response || error.response.status >= 500) {
                setErrorMessage("Không thể kết nối dịch vụ đăng nhập. Vui lòng thử lại.");
            } else {
                const data = error.response.data;
                setErrorMessage(data?.message || data?.error ||
                    (typeof data === "string" ? data : "Sai tài khoản hoặc mật khẩu!"));
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="portal-container">
            <div className="portal-hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <span className="brand-label">LADO COFFEE SYSTEM</span>
                        <div className="hero-title-wrapper">
                            <h1 className="hero-title">Hệ thống quản lý</h1>
                            <h1 className="hero-title highlight">vận hành cửa hàng</h1>
                        </div>
                        <p className="hero-description">
                            Nền tảng quản trị thông minh giúp theo dõi doanh thu
                        </p><br/>
                        <p> quản lý kho và tối ưu quy trình phục vụ.</p>
                    </div>
                    <div className="hero-footer">
                        <span>© 2024 Lado Coffee Portal</span>
                        <span>Hỗ trợ kỹ thuật</span>
                    </div>
                </div>
            </div>

            <div className="portal-form-section">
                <div className="top-right-logo">
                    <img src="/lg_lado.png" alt="Lado Logo" />
                </div>

                <div className="form-wrapper">
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="welcome-text-group">
                            <h2 className="form-welcome">Chào mừng trở lại</h2>
                            <p className="form-subtitle">Vui lòng đăng nhập hệ thống Lado Coffee</p>
                        </div>

                        <div className="input-field">
                            <label>Tên đăng nhập / Email</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="Nhập tài khoản"
                                    value={tenDangNhap}
                                    onChange={(e) => setTenDangNhap(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-field">
                            <label>Mật khẩu</label>
                            <div className="input-icon-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
                                    value={matKhau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                />
                                <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "👁️" : "🙈"}
                                </span>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me"><input type="checkbox" /> Ghi nhớ</label>
                            <span className="link" onClick={() => navigate("/register")}>Đăng ký?</span>
                            <span className="link" onClick={() => navigate("/forgot")}>Quên mật khẩu?</span>
                        </div>

                        {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}
                        <button type="submit" className="btn-portal-submit" disabled={isLoggingIn} aria-busy={isLoggingIn}>
                            {isLoggingIn ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP HỆ THỐNG"}
                        </button>

                        <div className="form-footer-actions">
                            <button type="button" className="btn-outline">📖 Hướng dẫn</button>
                            <button type="button" className="btn-outline">🎧 Liên hệ Admin</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
