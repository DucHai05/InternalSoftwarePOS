import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerOrderPage from './pages/CustomerOrder/CustomerOrderPage';
import Dashboard from './pages/DashboardPage/DashboardPage';
import DoanhThuPage from './pages/DoanhThu/DoanhThuList';
import KhuVucManager from './pages/KhuVuc/KhuVucManager';
import BanPage from './pages/Ban/BanManager';
import OrderPage from './pages/OrderPage/OrderPage';
import TableMapPage from './pages/OrderTableMap/tableMapPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PromotionPage from './pages/Promotion/PromotionPage';
import CaPage from './pages/Ca/CaManager';
import LoginPage from './pages/Auth/LoginPage';
import Register from './pages/Auth/RegisterPage';
import ForgotPassword from './pages/Auth/ForgotPasswordPage';
import EmployeeManagement from './pages/Auth/EmployeeManagementPage';
import ProfilePage from './pages/Auth/ProfilePage';
import ChamCongPage from './pages/Auth/ChamCongPage';
import SalaryPage from './pages/SalaryPage/SalaryPage';
import SanPhamPage from './pages/SanPham/SanPhamList';  
import LoaiSPPage from './pages/LoaiSanPham/LoaiSanPhamList';  
import NguyenLieuList from './pages/Kho/NguyenLieuList';



const sectionStyle = {
  background: '#f9f9f9',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #eee',
};

const titleStyle = {
  marginBottom: '15px',
  color: '#333',
  borderLeft: '4px solid #1890ff',
  paddingLeft: '10px',
};

const TableManager = () => {
  const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      <section style={sectionStyle}>
        <h3 style={titleStyle}>Quan ly khu vuc</h3>
        <KhuVucManager onSelectKhuVuc={setSelectedKhuVuc} />
      </section>

      <section style={sectionStyle}>
        <h3 style={titleStyle}>
          Quan ly danh sach ban
          {selectedKhuVuc && <span style={{ color: '#1890ff' }}> - {selectedKhuVuc.tenKhuVuc}</span>}
        </h3>

        {selectedKhuVuc ? (
          <BanPage khuVuc={selectedKhuVuc} />
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999',
              border: '2px dashed #ccc',
              borderRadius: '8px',
            }}
          >
            <h4>Vui long chon mot khu vuc ben tren de quan ly ban</h4>
          </div>
        )}
      </section>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-order" element={<Navigate to="/order/BAN101" replace />} />
        <Route path="/order/:maBan" element={<CustomerOrderPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sell" element={<TableMapPage />} />
          <Route path="/discount" element={<PromotionPage />} />
          <Route path="/ca" element={<CaPage />} />
          <Route path="/doanh-thu" element={<DoanhThuPage />} />
          <Route path="/staff/order/:maBan" element={<OrderPage />} />
          <Route path="/table-map" element={<TableManager />} />
          <Route path="/payment/:maBan" element={<PaymentPage />} />
          <Route path="/nhan-su" element={<EmployeeManagement />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/cham-cong" element={<ChamCongPage />} />
          <Route path="/product" element={<SanPhamPage />} />
          <Route path="/loai-sp" element={<LoaiSPPage />} />
          <Route path="/store" element={<NguyenLieuList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
