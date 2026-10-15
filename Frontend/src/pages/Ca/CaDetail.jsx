import React, { useState, useEffect, useMemo } from 'react';
import { doanhthuApi, hoaDonApi } from '../../api/APIGateway';
import {
  ChevronLeft,
  Clock,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ShoppingBag,
  Search,
  Filter,
  FileText,
  Tag
} from 'lucide-react';
import { formatShiftTime } from '../../utils/formatShiftTime';
import './CaDetail.css';

const CaDetail = ({ ca, onBack }) => {
    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('Tất cả');
    const [doanhThu, setDoanhThu] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!ca?.maCa) return;
            try {
                setLoading(true);
                const [resDoanhThu, resHoaDon] = await Promise.all([
                    doanhthuApi.getByCa(ca.maCa),
                    hoaDonApi.getByCa(ca.maCa)
                ]);

                if (resDoanhThu.data) {
                    setDoanhThu(Array.isArray(resDoanhThu.data) ? resDoanhThu.data[0] : resDoanhThu.data);
                }
                setOrders(resHoaDon.data || []);
            } catch (error) {
                console.error('Lỗi fetch dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ca]);

    const totals = useMemo(() => {
        return orders.reduce((acc, order) => {
            const amount = Number(order.tongTienSauKM || order.tongTien || 0);
            const method = order.phuongThucThanhToan;
            if (method === 'CASH' || method === 'Tiền mặt') acc.cash += amount;
            else if (method === 'TRANSFER' || method === 'Chuyển khoản') acc.transfer += amount;
            return acc;
        }, { cash: 0, transfer: 0 });
    }, [orders]);

    const allProductsInOrders = useMemo(() => {
        const extracted = [];
        orders.forEach((order) => {
            const items = order.items || order.chiTiet || [];
            items.forEach((item) => {
                extracted.push({
                    maSP: item.maSanPham || '---',
                    tenSP: item.tenSanPham || 'Sản phẩm',
                    loai: item.loai || 'Khác',
                    soLuong: Number(item.soLuong || 0),
                    donGia: Number(item.giaBan || 0),
                    thanhTien: Number(item.thanhTien || (item.soLuong * item.giaBan))
                });
            });
        });
        return extracted;
    }, [orders]);

    const categories = useMemo(() => {
        return ['Tất cả', ...Array.from(new Set(allProductsInOrders.map((item) => item.loai)))];
    }, [allProductsInOrders]);

    const filteredProducts = useMemo(() => {
        return allProductsInOrders.filter((product) => {
            const matchesCategory = category === 'Tất cả' || product.loai === category;
            const matchesSearch =
                !searchText || `${product.maSP} ${product.tenSP}`.toLowerCase().includes(searchText.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allProductsInOrders, category, searchText]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const tienMatTrongKet = Number(ca?.soTienKet || 0);

    if (loading) return (
        <div className="ca-loading-container">
            <div className="loader"></div>
            <p>Đang đối soát dữ liệu ca {ca.maCa}...</p>
        </div>
    );

    return (
        <div className="ca-detail-container">
            <div className="ca-detail-nav">
                <button className="btn-back-ghost" onClick={onBack}>
                    <ChevronLeft size={20} /> Quay lại danh sách
                </button>
                <div className="ca-title-group">
                    <h1>Chi tiết ca làm việc</h1>
                    <span className={`badge-status ${ca.trangThai === 'Đã đóng' ? 'closed' : 'active'}`}>
                        {ca.trangThai || 'Đang mở'}
                    </span>
                </div>
            </div>

            <div className="ca-detail-grid">
                <div className="ca-info-card">
                    <div className="card-header">
                        <Clock size={20} /> <h3>Thông tin vận hành</h3>
                    </div>
                    <div className="info-list">
                        <div className="info-item">
                            <label><Tag size={14}/> Mã ca</label>
                            <span>{ca.maCa}</span>
                        </div>
                        <div className="info-item">
                            <label><User size={14}/> Nhân viên</label>
                            <span>{ca.tenNhanVien || ca.maNhanVien}</span>
                        </div>
                        <div className="info-item">
                            <label><Calendar size={14}/> Ngày làm việc</label>
                            <span>{ca.ngayThang}</span>
                        </div>
                        <div className="info-item">
                            <label><Clock size={14}/> Thời gian</label>
                            <span>{formatShiftTime(ca.gioMoCa)} - {formatShiftTime(ca.gioDongCa)}</span>
                        </div>
                    </div>
                </div>

                <div className="ca-revenue-card">
                    <div className="card-header">
                        <DollarSign size={20} /> <h3>Tổng hợp doanh thu</h3>
                    </div>
                    <div className="revenue-stats-grid">
                        <div className="stat-box">
                            <div className="stat-icon cash"><DollarSign size={20}/></div>
                            <div className="stat-info">
                                <label>Tiền mặt</label>
                                <h4>{formatCurrency(totals.cash || doanhThu?.tienMat)}</h4>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon transfer"><CreditCard size={20}/></div>
                            <div className="stat-info">
                                <label>Chuyển khoản</label>
                                <h4>{formatCurrency(totals.transfer || doanhThu?.tienCK)}</h4>
                            </div>
                        </div>
                        <div className="stat-box thu-chi-combined">
                            <div className="stat-info full">
                                <div className="thu-chi-columns">
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-success">
                                            <ArrowUpCircle size={16}/> Thu
                                        </span>
                                        <strong className="text-success">+{formatCurrency(doanhThu?.tienThu)}</strong>
                                    </div>
                                    <div className="thu-chi-col">
                                        <span className="thu-chi-label text-danger">
                                            <ArrowDownCircle size={16}/> Chi
                                        </span>
                                        <strong className="text-danger">-{formatCurrency(doanhThu?.tienChi)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon wallet"><Wallet size={20}/></div>
                            <div className="stat-info">
                                <label>Tiền mặt trong két</label>
                                <h4>{formatCurrency(tienMatTrongKet)}</h4>
                            </div>
                        </div>
                        <div className="stat-box full-width highlight">
                            <div className="stat-icon wallet"><Wallet size={24}/></div>
                            <div className="stat-info">
                                <label>Tổng thực thu trong ca (Doanh số)</label>
                                <h2>{formatCurrency(totals.cash + totals.transfer)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ca-products-section">
                <div className="section-header">
                    <div className="header-left">
                        <ShoppingBag size={22} />
                        <h3>Sản phẩm đã bán trong ca</h3>
                    </div>
                    <div className="header-filters">
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Tìm món..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        <div className="filter-select">
                            <Filter size={18} />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="ca-table-wrapper">
                    <table className="ca-modern-table">
                        <thead>
                            <tr>
                                <th>Mã SP</th>
                                <th>Tên sản phẩm</th>
                                <th>Phân loại</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th style={{ textAlign: 'right' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" className="empty-row">Không có dữ liệu bán hàng trong ca này.</td></tr>
                            ) : (
                                filteredProducts.map((p, i) => (
                                    <tr key={`${p.maSP}-${i}`}>
                                        <td className="font-mono">{p.maSP}</td>
                                        <td className="font-semibold">{p.tenSP}</td>
                                        <td><span className="category-pill">{p.loai}</span></td>
                                        <td>{p.soLuong}</td>
                                        <td>{p.donGia.toLocaleString()}đ</td>
                                        <td style={{ textAlign: 'right' }} className="font-bold">
                                            {p.thanhTien.toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="ca-bottom-grid">
                <div className="note-card">
                    <div className="card-header"><FileText size={18}/> <h3>Ghi chú bàn giao</h3></div>
                    <p>{ca.ghiChu || 'Không có ghi chú phát sinh.'}</p>
                </div>
                <div className="note-card">
                    <div className="card-header"><Tag size={18}/> <h3>Chương trình khuyến mãi</h3></div>
                    <p>{ca.khuyenMai || 'Không có chương trình áp dụng.'}</p>
                </div>
            </div>
        </div>
    );
};

export default CaDetail;
