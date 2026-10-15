import React, { useEffect, useMemo, useState } from 'react';
import { productApi } from '../../api/APIGateway';
import './HoaDonDetail.css';

const HoaDonDetail = ({ order, onBack }) => {
  const [sanPhamMap, setSanPhamMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sanPhamRes = await productApi.getProducts();
        const sanPhamList = Array.isArray(sanPhamRes.data) ? sanPhamRes.data : [];
        const sanPhamById = sanPhamList.reduce((acc, sanPham) => {
          acc[sanPham.maSanPham] = sanPham.tenSanPham;
          return acc;
        }, {});

        setSanPhamMap(sanPhamById);
      } catch (error) {
        console.error('Khong the tai danh sach san pham:', error);
      }
    };

    fetchData();
  }, []);

  if (!order) return <div className="receipt-container">Đang tải...</div>;

  const formatVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    if (Number.isNaN(date.getTime())) return timeStr;

    const dd = date.getDate().toString().padStart(2, '0');
    const mo = (date.getMonth() + 1).toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');

    return `${dd}-${mo} ${hh}:${mm}:${ss}`;
  };

  const productList = useMemo(() => {
    const rawList = order.chiTietHDs || order.chiTiet || order.sanPham || order.items || [];

    return rawList.map((item) => {
      const maMon = item.maSanPham || item.maMon;
      const soLuong = Number(item.soLuong || 0);
      const donGia = Number(item.donGia ?? item.giaBan ?? 0);

      return {
        ...item,
        maMon,
        tenMon: item.tenMon || item.tenSanPham || sanPhamMap[maMon] || maMon || 'Không rõ',
        soLuong,
        donGia,
        thanhTien: donGia * soLuong,
      };
    });
  }, [order, sanPhamMap]);

  const tableName = order.tenBan || order.ban || order.maBan || order.tableId || 'N/A';

  return (
    <div className="receipt-container">
      <div className="receipt-title">Chi Tiết Hóa Đơn</div>

      <div className="receipt-header-section">
        <div className="receipt-header-row">
          <span className="label">Mã HĐ:</span>
          <span className="value">{order.maHoaDon || order.id}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Bàn:</span>
          <span className="value">{tableName}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Giờ vào:</span>
          <span className="value">{formatTime(order.thoiGianVao || order.gioVao)}</span>
        </div>
        <div className="receipt-header-row">
          <span className="label">Giờ ra:</span>
          <span className="value">{formatTime(order.thoiGianRa || order.gioRa)}</span>
        </div>
      </div>

      <table className="receipt-table">
        <thead>
          <tr>
            <th width="40" className="text-center">STT</th>
            <th>Tên món</th>
            <th className="text-center">SL</th>
            <th className="text-right">Đơn giá</th>
            <th className="text-right">T.Tiền</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((item, index) => (
            <tr key={item.maChiTietHD || `${item.maMon}-${index}`}>
              <td className="text-center">{index + 1}</td>
              <td style={{ fontWeight: 500 }}>{item.tenMon}</td>
              <td className="text-center">{item.soLuong}</td>
              <td className="text-right">{formatVND(item.donGia)}</td>
              <td className="text-right">{formatVND(item.thanhTien)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="receipt-summary-box">
        <div className="summary-row">
          <span className="label">Chiết khấu:</span>
          <span className="value">{formatVND(order.chietKhau)}</span>
        </div>
        <div className="summary-row total">
          <span className="label">TỔNG CỘNG:</span>
          <span className="value">{formatVND(order.tongHoaDon || order.tongTien)}</span>
        </div>
        <div className="summary-row">
          <span className="label">Phương thức:</span>
          <span className="value" style={{ fontWeight: 'bold' }}>{order.phuongThucThanhToan || 'CASH'}</span>
        </div>
      </div>

      <div className="receipt-actions">
        <button className="btn" onClick={onBack}>Quay lại</button>
        <button className="btn btn-primary" onClick={() => window.print()}>In lại hóa đơn</button>
      </div>
    </div>
  );
};

export default HoaDonDetail;
