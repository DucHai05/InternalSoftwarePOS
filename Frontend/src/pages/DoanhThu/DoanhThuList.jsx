import React, { useState, useEffect, useMemo } from 'react';
import { doanhthuApi, caApi } from '../../api/APIGateway';
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  CreditCard, 
  Banknote, 
  History, 
  Filter, 
  RefreshCcw,
  ArrowUpRight,
  User,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import DoanhThuDetail from './DoanhThuDetail';
import { formatShiftTime } from '../../utils/formatShiftTime';
import './DoanhThuList.css';

const DoanhThuManager = () => {
    const [doanhThus, setDoanhThus] = useState([]);
    const [selectedDoanhThu, setSelectedDoanhThu] = useState(null);
    const [filterDays, setFilterDays] = useState('7');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [doanhThuResponse, caResponse] = await Promise.all([
                doanhthuApi.getAll(),
                caApi.getAll()
            ]);

            const doanhThuData = doanhThuResponse.data || [];
            const caData = caResponse.data || [];
            const caMap = {};
            caData.forEach(ca => { if (ca.maCa) caMap[ca.maCa] = ca; });

            const enrichedDoanhThus = doanhThuData.map(dt => {
                const matchedCa = caMap[dt.maCa] || (dt.ca && caMap[dt.ca.maCa]) || null;
                return {
                    ...dt,
                    ca: matchedCa || dt.ca || null,
                    tongDoanhThu: (Number(dt.tienMat || 0) + Number(dt.tienCK || 0))
                };
            });

            setDoanhThus(enrichedDoanhThus);
        } catch (error) {
            setError('Không thể kết nối đến máy chủ doanh thu.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    const getDoanhThuDate = (dt) => {
        const val = dt.ca?.gioMoCa || dt.gioMoCa || dt.ca?.ngayThang || dt.ca?.gioMo || dt.gioMo;
        if (!val) return null;
        const parsed = new Date(val);
        // Nếu ngày không hợp lệ, trả về null để bộ lọc không bị NaN
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const filteredList = useMemo(() => {
        const filtered = filterDays === 'all'
            ? doanhThus
            : doanhThus.filter((dt) => {
                const date = getDoanhThuDate(dt);
                // Nếu không có ngày hoặc ngày lỗi, giữ lại để không bị mất data
                if (!date) return true;

                const diffDays = (new Date() - date) / (1000 * 60 * 60 * 24);
                return diffDays <= Number(filterDays);
            });

        return [...filtered].sort((first, second) => {
            const firstIsOpen = first.ca?.trangThai === 'Mở';
            const secondIsOpen = second.ca?.trangThai === 'Mở';
            return Number(secondIsOpen) - Number(firstIsOpen);
        });
    }, [doanhThus, filterDays]);

    // Tính tổng số liệu cho phần Stats đầu trang
    const stats = useMemo(() => {
        return filteredList.reduce((acc, curr) => {
            acc.total += curr.tongDoanhThu;
            acc.cash += Number(curr.tienMat || 0);
            acc.transfer += Number(curr.tienCK || 0);
            return acc;
        }, { total: 0, cash: 0, transfer: 0 });
    }, [filteredList]);

    if (selectedDoanhThu) return <DoanhThuDetail doanhThu={selectedDoanhThu} onBack={() => setSelectedDoanhThu(null)} />;

    return (
        <div className="doanhthu-container">
            <header className="doanhthu-header">
                <div className="header-left">
                    <h1>Quản lý doanh thu</h1>
                    <p>Lịch sử đối soát và tăng trưởng theo ca làm việc</p>
                </div>
                <div className="header-actions">
                    <div className="filter-box">
                        <Filter size={18} />
                        <select value={filterDays} onChange={(e) => setFilterDays(e.target.value)}>
                            <option value="7">7 ngày qua</option>
                            <option value="30">30 ngày qua</option>
                            <option value="all">Tất cả thời gian</option>
                        </select>
                    </div>
                    <button className="refresh-btn" onClick={fetchData}>
                        <RefreshCcw size={18} /> Làm mới
                    </button>
                </div>
            </header>

            {/* TOP STATS CARDS */}
            <div className="doanhthu-stats-row">
                <div className="stat-card primary">
                    <div className="stat-icon"><BarChart3 size={24}/></div>
                    <div className="stat-content">
                        <label>Tổng doanh thu ({filterDays === 'all' ? 'Tất cả' : `${filterDays} ngày`})</label>
                        <h2>{formatCurrency(stats.total)}</h2>
                    </div>
                    <div className="stat-bg-icon"><TrendingUp size={80}/></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon cash"><Banknote size={24}/></div>
                    <div className="stat-content">
                        <label>Tổng Tiền mặt</label>
                        <h3>{formatCurrency(stats.cash)}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon transfer"><CreditCard size={24}/></div>
                    <div className="stat-content">
                        <label>Tổng Chuyển khoản</label>
                        <h3>{formatCurrency(stats.transfer)}</h3>
                    </div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="doanhthu-grid">
                {loading ? (
                    <div className="loading-state">Đang tải dữ liệu...</div>
                ) : filteredList.length === 0 ? (
                    <div className="empty-state">
                        <History size={48} />
                        <h3>Không có dữ liệu</h3>
                        <p>Không tìm thấy bản ghi doanh thu nào trong khoảng thời gian này.</p>
                    </div>
                ) : (
                    filteredList.map((dt) => (
                        <div key={dt.maDoanhThu} className="doanhthu-card" onClick={() => setSelectedDoanhThu(dt)}>
                            <div className="card-top">
                                <div className="id-group">
                                    <span className="ma-dt">{dt.maDoanhThu}</span>
                                    <h3>{dt.ca?.tenCa || 'Ca làm việc'}</h3>
                                </div>
                                <div className="total-badge">
                                    {formatCurrency(dt.tongDoanhThu)}
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="info-item">
                                    <User size={14} /> <span>Nhân viên:</span> <strong>{dt.ca?.maNhanVien || '-'}</strong>
                                </div>
                                <div className="info-item">
                                    <Calendar size={14} /> <span>Ngày:</span> <strong>{dt.ca?.ngayThang || '-'}</strong>
                                </div>
                                <div className="info-item">
                                    <Clock size={14} /> <span>Thời gian:</span> 
                                    <strong>{formatShiftTime(dt.ca?.gioMoCa)} - {dt.ca?.gioDongCa ? formatShiftTime(dt.ca.gioDongCa) : '...'}</strong>
                                </div>

                                <div className="method-split">
                                    <div className="method-item">
                                        <label>Tiền mặt</label>
                                        <span>{formatCurrency(dt.tienMat)}</span>
                                    </div>
                                    <div className="method-item">
                                        <label>Chuyển khoản</label>
                                        <span>{formatCurrency(dt.tienCK)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className={`status-pill ${dt.ca?.trangThai === 'Đóng' ? 'closed' : 'open'}`}>
                                    {dt.ca?.trangThai === 'Đóng' ? 'Đã kết toán' : 'Đang vận hành'}
                                </span>
                                <span className="view-detail">Chi tiết <ChevronRight size={16} /></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Helper icon cho trang trí
const TrendingUp = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.05, position: 'absolute', right: -10, bottom: -10}}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
);

export default DoanhThuManager;