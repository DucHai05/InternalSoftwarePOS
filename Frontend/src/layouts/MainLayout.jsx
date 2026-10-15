import { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, TableProperties, ClipboardList, 
  History, Settings, LogOut, Bell, UserCircle
} from 'lucide-react';
import { notificationApi } from '../api/APIGateway';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import './MainLayout.css';
import ladoLogo from '../assets/LADO.png';

const MainLayout = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  
  // --- STATE CHO USER (Lấy từ dữ liệu thực tế khi Login) ---
  const maNhanVien = localStorage.getItem('maNhanVien'); 
  const tenNhanVien = localStorage.getItem('tenNhanVien');
  const userRole = localStorage.getItem('role');

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState(null);
  
  const dropdownRef = useRef(null);

  // Bảo vệ Route: Nếu chưa đăng nhập -> Đá về Login
  useEffect(() => {
    if (!maNhanVien) {
      navigate('/login');
    }
  }, [maNhanVien, navigate]);

  // Xử lý đồng hồ góc phải trên cùng
  useEffect(() => {
    const formatTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setCurrentTime(formatTime());
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- XỬ LÝ LẤY DATA THÔNG BÁO VÀ KẾT NỐI WEBSOCKET (CỔNG 8089) ---
  useEffect(() => {
    // Nếu chưa đăng nhập thì không gọi API làm gì cả
    if (!maNhanVien) return;

    // 1. Lấy danh sách thông báo cũ từ Database khi vừa mở trang
    const fetchNotifications = async () => {
      try {
        const resList = await notificationApi.getByEmployee(maNhanVien);
        const resCount = await notificationApi.getUnreadCount(maNhanVien);
        setNotifications(resList.data);
        setUnreadCount(resCount.data);
      } catch (error) {
        console.error("Không thể kết nối tới Notification Service qua API Gateway:", error);
      }
    };
    fetchNotifications();

    // 2. Mở kết nối WebSocket (Real-time) để hứng thông báo mới
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8089/ws-notifications'),
      onConnect: () => {
        console.log(`🟢 Đã kết nối WebSocket thành công cho user: ${maNhanVien}`);
        
        // 1: Kênh cá nhân: Lắng nghe đúng kênh của nhân viên này
        client.subscribe(`/topic/notifications/${maNhanVien}`, (message) => {
          const newNotification = JSON.parse(message.body);
          
          // Khi có tin nhắn mới: Tăng số đếm cục đỏ, nhét thông báo mới lên đỉnh danh sách
          playAudioAlert();
          setUnreadCount(prev => prev + 1);
          setNotifications(prev => [newNotification, ...prev]);
        });
        // 2. THÊM ĐOẠN NÀY: Kênh nhóm cho Quản lý
        // Nếu người đang đăng nhập có quyền ADMIN, họ sẽ nghe thêm kênh 'ADMIN_GROUP'
        if (userRole === 'ADMIN') {
          client.subscribe(`/topic/notifications/ADMIN_GROUP`, (message) => {
            const newNotification = JSON.parse(message.body);
            playAudioAlert(); // Tiếng chuông báo
            setUnreadCount(prev => prev + 1); // Tăng số lượng tin chưa đọc trên chuông
            setNotifications(prev => [newNotification, ...prev]); // Đẩy tin nhắn mới lên đầu danh sách
          });
        }
      },
      onDisconnect: () => console.log("🔴 Đã ngắt kết nối WebSocket"),
    });

    client.activate(); // Bắt đầu cắm ống nghe

    // Dọn dẹp kết nối khi thoát trang
    return () => {
      client.deactivate();
    };
  }, [maNhanVien]);

  // Click chuột ra ngoài vùng dropdown sẽ tự động đóng nó lại
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const playAudioAlert = () => {
    // const audio = new Audio('/ting.mp3'); 
    // audio.play().catch(e => console.log(e));
  };

  // Đánh dấu đã đọc khi click vào 1 thông báo
  const handleReadNotification = async (tb) => {
    // 1. Lấy đúng ID (đề phòng backend trả về 'id' thay vì 'maThongBao')
    const notifId = tb.maThongBao || tb.id;

    // 2. Toggle mở rộng/thu gọn nội dung
    setExpandedNotifId(prevId => prevId === notifId ? null : notifId);

    // 3. Logic đánh dấu đã đọc (Mất chấm đỏ)
    if (!tb.daDoc) {
      try {
        await notificationApi.markAsRead(notifId);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(notifications.map(item => 
          (item.maThongBao === notifId || item.id === notifId) ? { ...item, daDoc: true } : item
        ));
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đã đọc:", error);
      }
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Chống lỗi render giao diện khi đang redirect về Login
  if (!maNhanVien) return null;

  return (
    <div className="pos-app">
      {/* ---------- SIDEBAR (MENU TRÁI) ---------- */}
      <aside className="pos-sidebar">
        <div className="brand">
          <div className="logo-box">
            <img src={ladoLogo} alt="Lado Coffee Logo" className="logo-img" />
          </div>
        </div>

        <nav className="nav-group">
          <label>Vận hành</label>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/sell" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Bán hàng</span>
          </NavLink>
          <NavLink to="/cham-cong" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <TableProperties size={20} /> <span>Chấm công</span>
          </NavLink>
          {userRole !== 'STAFF' && (
            <>
              <NavLink to="/discount" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <ClipboardList size={20} /> <span>Khuyến mãi</span>
              </NavLink>
              <NavLink to="/table-map" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <TableProperties size={20} /> <span>Bàn & Khu vực</span>
              </NavLink>
              <NavLink to="/doanh-thu" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <ClipboardList size={20} /> <span>Doanh thu</span>
              </NavLink>
              <NavLink to="/ca" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <History size={20} /> <span>Ca làm việc</span>
              </NavLink>
              <NavLink to="/nhan-su" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <History size={20} /> <span>Nhân sự</span>
              </NavLink>
              <NavLink to="/product" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <History size={20} /> <span>Sản phẩm</span>
              </NavLink>
              <NavLink to="/loai-sp" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <History size={20} /> <span>Loại sản phẩm</span>
              </NavLink>
            </>
          )}
          <NavLink to="/store" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <History size={20} /> <span>Kho</span>
          </NavLink>
          {userRole !== 'STAFF'   && (
            <NavLink to="/salary" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Settings size={20} /> <span>Lương/ Thưởng</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" onClick={() => navigate('/profile')} >
            <UserCircle size={32} color="#4f46e5" strokeWidth={1.5} />
            <div className="user-meta">
              <p className="user-name">{tenNhanVien || 'Chưa cập nhật'}</p>
              <p className="user-role">{userRole || 'Chưa cập nhật'}</p>
            </div>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> <span>Kết thúc ca</span>
          </button>
        </div>
      </aside>

      {/* ---------- MAIN CONTENT (NỘI DUNG CHÍNH) ---------- */}
      <main className="pos-main">
        <header className="pos-topbar">
          <div className="topbar-actions">
            <div className="status-indicator">
              <span className="dot online"></span>
              Server Online
            </div>
            
            {/* 🌟 KHU VỰC CHUÔNG THÔNG BÁO 🌟 */}
            <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className="icon-btn position-relative" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN DANH SÁCH THÔNG BÁO (ĐÃ NÂNG CẤP UI) */}
             {showDropdown && (
                    <div className="notification-dropdown shadow">
                      {/* Tiêu đề bảng */}
                      <div className="notification-dropdown-header">
                        <h6>Thông báo của bạn</h6>
                        {unreadCount > 0 && <span className="badge-new-count">{unreadCount} mới</span>}
                      </div>

                      {/* Danh sách thông báo */}
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="notification-empty">Chưa có thông báo nào</div>
                        ) : (
                          notifications.map(tb => (
                            <div 
                              key={tb.maThongBao} 
                              className={`notification-item ${!tb.daDoc ? 'unread' : ''}`}
                              onClick={() => handleReadNotification(tb)}
                            >
                              <div className="notification-item-top">
                                <div className="notification-title-group">
                                  <span className="status-icon">
                                    {!tb.daDoc ? '🔴' : '✅'}
                                  </span>
                                  <strong className="notification-title">
                                    {tb.tieuDe}
                                  </strong>
                                </div>
                                <small className="notification-time">
                                  {new Date(tb.ngayTao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </small>
                              </div>
                              
                              {/* Nội dung thông báo */}
                            <div className={`notification-content ${expandedNotifId === (tb.maThongBao || tb.id) ? 'expanded' : ''}`}>
                              {tb.noiDung}
                            </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
            </div>

            <div className="time-display">{currentTime}</div>
          </div>
        </header>
        
        <section className="pos-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;