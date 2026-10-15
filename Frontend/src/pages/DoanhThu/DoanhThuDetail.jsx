import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { hoaDonApi, tableApi, productApi, doanhthuApi, phieuThuChiApi } from '../../api/APIGateway';
import {
  ChevronLeft,
  Info,
  DollarSign,
  Package,
  Receipt,
  MessageSquare,
  User,
  Calendar,
  Clock,
  ArrowUpRight,
  CreditCard,
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import HoaDonDetail from '../../components/HoaDon/HoaDonDetail.jsx';
import { formatShiftTime } from '../../utils/formatShiftTime';
import './DoanhThuDetail.css';

const DoanhThuDetail = ({ doanhThu, onBack }) => {
    const [hoaDons, setHoaDons] = useState([]);
    const [doanhThuCa, setDoanhThuCa] = useState(doanhThu);
    const [phieuThuChi, setPhieuThuChi] = useState([]);
    const [banMap, setBanMap] = useState({});
    const [sanPhamMap, setSanPhamMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchRelatedData = useCallback(async () => {
        try {
            setLoading(true);
            const [hoaDonRes, banRes, sanPhamRes, doanhThuRes, phieuThuChiRes] = await Promise.all([
                hoaDonApi.getByCa(doanhThu.maCa),
                tableApi.getTables(),
                productApi.getProducts(),
                doanhthuApi.getByCa(doanhThu.maCa),
                phieuThuChiApi.getByCa(doanhThu.maCa)
            ]);

            const nextBanMap = {};
            if (Array.isArray(banRes.data)) {
                banRes.data.forEach((ban) => {
                    if (ban.maBan) nextBanMap[ban.maBan] = ban.tenBan || ban.maBan;
                });
            }

            const nextSanPhamMap = {};
            if (Array.isArray(sanPhamRes.data)) {
                sanPhamRes.data.forEach((sanPham) => {
                    if (sanPham.maSanPham) {
                        nextSanPhamMap[sanPham.maSanPham] = sanPham;
                    }
                });
            }

            setBanMap(nextBanMap);
            setSanPhamMap(nextSanPhamMap);
            setHoaDons(Array.isArray(hoaDonRes.data) ? hoaDonRes.data : []);
            setDoanhThuCa(doanhThuRes.data || doanhThu);
            setPhieuThuChi(Array.isArray(phieuThuChiRes.data) ? phieuThuChiRes.data : []);
        } catch (error) {
            console.error('Loi tai du lieu:', error);
        } finally {
            setLoading(false);
        }
    }, [doanhThu]);

    useEffect(() => {
        if (doanhThu?.maCa) fetchRelatedData();
    }, [doanhThu, fetchRelatedData]);

    const extractedProducts = useMemo(() => {
        const aggregated = {};

        hoaDons.forEach((order) => {
            const items = order.chiTietHDs || order.items || order.chiTiet || [];

            items.forEach((item) => {
                const maSP = item.maSanPham || item.maMon || '---';
                const sanPham = sanPhamMap[maSP] || {};
                const soLuong = Number(item.soLuong || 0);
                const donGia = Number(item.donGia ?? item.giaBan ?? sanPham.donGia ?? 0);
                const key = `${maSP}-${donGia}`;

                if (!aggregated[key]) {
                    aggregated[key] = {
                        maSP,
                        tenSP: item.tenSanPham || item.tenMon || sanPham.tenSanPham || maSP,
                        loai: sanPham.tenLoaiSanPham || item.loai || 'Chưa phân loại',
                        soLuong: 0,
                        donGia,
                        thanhTien: 0
                    };
                }

                aggregated[key].soLuong += soLuong;
                aggregated[key].thanhTien += donGia * soLuong;
            });
        });

        return Object.values(aggregated);
    }, [hoaDons, sanPhamMap]);

    const totals = useMemo(() => {
        return hoaDons.reduce((acc, order) => {
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
            const method = order.phuongThucThanhToan;
            if (method === 'CASH' || method === 'Tiền mặt') acc.cash += amount;
            else if (method === 'TRANSFER' || method === 'Chuyển khoản') acc.transfer += amount;
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [hoaDons]);

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    const cashTotal = totals.cash || Number(doanhThuCa?.tienMat || 0);
    const transferTotal = totals.transfer || Number(doanhThuCa?.tienCK || 0);
    const phieuThu = phieuThuChi.filter((item) => item.loaiPhieu === 'Thu');
    const phieuChi = phieuThuChi.filter((item) => item.loaiPhieu === 'Chi');

    if (selectedOrder) {
        return <HoaDonDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    if (loading) return (
        <div className="detail-loading-wrapper">
            <div className="modern-loader"></div>
            <p>Đang trích xuất dữ liệu đối soát...</p>
        </div>
    );

    return (
        <div className="doanhthu-detail-wrapper">
            <div className="detail-nav">
                <button className="btn-back-ghost" onClick={onBack}>
                    <ChevronLeft size={20} /> Quay lại
                </button>
                <div className="detail-title">
                    <h1>Báo cáo chi tiết ca</h1>
                    <span className="id-badge">#{doanhThu.maDoanhThu}</span>
                </div>
            </div>

            <div className="detail-grid-top">
                <div className="detail-card info-card">
                    <div className="card-header"><Info size={18}/> <h3>Thông tin ca làm việc</h3></div>
                    <div className="info-body">
                        <div className="info-line"><label><Clock size={14}/> Mã ca:</label> <span>{doanhThu.ca?.maCa}</span></div>
                        <div className="info-line"><label><User size={14}/> Nhân viên:</label> <span>{doanhThu.ca?.tenNhanVien || doanhThu.ca?.maNhanVien || 'N/A'}</span></div>
                        <div className="info-line"><label><Calendar size={14}/> Ngày:</label> <span>{doanhThu.ca?.ngayThang}</span></div>
                        <div className="info-line"><label><Clock size={14}/> Thời gian:</label> <span>{formatShiftTime(doanhThu.ca?.gioMoCa)} - {formatShiftTime(doanhThu.ca?.gioDongCa)}</span></div>
                    </div>
                </div>

                <div className="detail-card stats-card">
                    <div className="card-header"><DollarSign size={18}/> <h3>Tổng hợp doanh thu</h3></div>
                    <div className="revenue-stats-grid">
                        <div className="stat-box">
                            <div className="stat-icon cash"><Banknote size={20}/></div>
                            <div className="stat-info">
                                <label>Tiền mặt</label>
                                <h4>{formatCurrency(cashTotal)}</h4>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon transfer"><CreditCard size={20}/></div>
                            <div className="stat-info">
                                <label>Chuyển khoản</label>
                                <h4>{formatCurrency(transferTotal)}</h4>
                            </div>
                        </div>
                        <div className="stat-box thu-chi-combined">
                            <div className="stat-info full">
                                <div className="thu-chi-columns">
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-success">
                                            <ArrowUpCircle size={16}/> Thu
                                        </span>
                                        <strong className="text-success">+{formatCurrency(doanhThuCa?.tienThu)}</strong>
                                    </div>
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-danger">
                                            <ArrowDownCircle size={16}/> Chi
                                        </span>
                                        <strong className="text-danger">-{formatCurrency(doanhThuCa?.tienChi)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon wallet"><Wallet size={20}/></div>
                            <div className="stat-info">
                                <label>Tiền mặt trong két</label>
                                <h4>{formatCurrency(doanhThu.ca?.soTienKet)}</h4>
                            </div>
                        </div>
                        <div className="stat-box full-width highlight">
                            <div className="stat-icon wallet"><Wallet size={24}/></div>
                            <div className="stat-info">
                                <label>Tổng thực thu trong ca (Doanh số)</label>
                                <h2>{formatCurrency(cashTotal + transferTotal)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <div className="section-header-modern">
                    <div className="h-left"><Package size={20}/> <h3>Sản phẩm đã bán ({extractedProducts.length})</h3></div>
                </div>
                <div className="modern-table-container">
                    <table className="modern-data-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên sản phẩm</th>
                                <th>Loại</th>
                                <th>SL</th>
                                <th>Đơn giá</th>
                                <th style={{ textAlign: 'right' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extractedProducts.length === 0 ? (
                                <tr><td colSpan="6" className="table-empty">Trống</td></tr>
                            ) : (
                                extractedProducts.map((p, idx) => (
                                    <tr key={`${p.maSP}-${p.donGia}-${idx}`}>
                                        <td className="txt-mono">{idx + 1}</td>
                                        <td className="txt-bold">{p.tenSP}</td>
                                        <td><span className="cat-pill">{p.loai}</span></td>
                                        <td>{p.soLuong}</td>
                                        <td>{formatCurrency(p.donGia)}</td>
                                        <td style={{ textAlign: 'right' }} className="txt-indigo">{formatCurrency(p.thanhTien)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="detail-section">
                <div className="section-header-modern">
                    <div className="h-left"><Receipt size={20}/> <h3>Lịch sử hóa đơn ({hoaDons.length})</h3></div>
                </div>
                <div className="orders-feed">
                    {hoaDons.map((order) => (
                        <div
                            key={order.maHoaDon}
                            className="feed-item"
                            onClick={() => setSelectedOrder({ ...order, tenBan: banMap[order.maBan] || order.maBan })}
                        >
                            <div className="order-left">
                                <div className="order-id">
                                    <strong>{order.maHoaDon}</strong>
                                    <span>{banMap[order.maBan] || order.maBan}</span>
                                </div>
                                <span className="order-time">{order.thoiGianVao?.split('.')[0]}</span>
                            </div>
                            <div className="order-right">
                                <span className="order-price">{formatCurrency(order.tongTien)}</span>
                                <span className="pay-method">{order.phuongThucThanhToan}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="detail-grid-bottom">
                <div className="detail-card note-card">
                    <div className="card-header"><MessageSquare size={18}/> <h3>Ghi chú bàn giao</h3></div>
                    <p>{doanhThu.ca?.ghiChu || 'Không có ghi chú.'}</p>
                </div>
                <div className="detail-card note-card">
                    <div className="card-header"><ArrowUpRight size={18}/> <h3>Chương trình áp dụng</h3></div>
                    <p>{doanhThu.ca?.khuyenMai || 'Không có khuyến mãi.'}</p>
                </div>
            </div>

            <div className="receipt-activity-grid">
                <section className="activity-column">
                    <div className="column-header">
                        <TrendingUp size={18} color="#10b981" />
                        <h3>Lịch sử thu tiền</h3>
                    </div>
                    <div className="activity-list">
                        {phieuThu.length === 0 ? (
                            <div className="empty-feed">Chưa có khoản thu nào.</div>
                        ) : (
                            phieuThu.map((item) => (
                                <div key={item.maPhieu} className="activity-item thu">
                                    <div className="item-main">
                                        <span className="item-code">{item.maPhieu}</span>
                                        <p className="item-note">{item.ghiChu}</p>
                                    </div>
                                    <div className="item-amount">+{formatCurrency(item.soTien)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
                <section className="activity-column">
                    <div className="column-header">
                        <TrendingDown size={18} color="#f43f5e" />
                        <h3>Lịch sử chi tiền</h3>
                    </div>
                    <div className="activity-list">
                        {phieuChi.length === 0 ? (
                            <div className="empty-feed">Chưa có khoản chi nào.</div>
                        ) : (
                            phieuChi.map((item) => (
                                <div key={item.maPhieu} className="activity-item chi">
                                    <div className="item-main">
                                        <span className="item-code">{item.maPhieu}</span>
                                        <p className="item-note">{item.ghiChu}</p>
                                    </div>
                                    <div className="item-amount">-{formatCurrency(item.soTien)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DoanhThuDetail;
