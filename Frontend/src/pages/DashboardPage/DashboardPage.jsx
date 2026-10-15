import React, { useState, useEffect, useMemo } from 'react';
import { 
    DollarSign, ShoppingBag, Ticket, Target, ChevronLeft, ChevronRight, 
    BarChart3, CreditCard, Banknote, TrendingUp 
} from 'lucide-react';
import './dashboardpage.css';

// Import ảnh banner của ông
import promo1 from '../../assets/promo.jpg';
import promo2 from '../../assets/promo2.jpg';
import promo3 from '../../assets/promo3.jpg';

import { promoApi, doanhthuApi } from '../../api/APIGateway';

const Dashboard = () => {
    const [currentPromos, setCurrentPromos] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [statsSummary, setStatsSummary] = useState({ total: 0, cash: 0, transfer: 0 });
    const [loading, setLoading] = useState(true);
    const [currentBanner, setCurrentBanner] = useState(0);

    // 1. Dữ liệu Banner
    const banners = [
        { id: 1, img: promo1, title: 'Coffee Day - Giảm 20% đơn hàng' },
        { id: 2, img: promo2, title: 'Ra mắt Trà Sữa Oolong Mới' },
        { id: 3, img: promo3, title: 'Đồng hành cùng Lado Coffee' }
    ];

    // 2. Fetch API & Xử lý dữ liệu
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [promoRes, doanhThuRes] = await Promise.all([
                    promoApi.getActivePromos(),
                    doanhthuApi.getAll()
                ]);

                if (promoRes.data) {
                    setCurrentPromos(promoRes.data.slice(0, 3));
                }

                if (doanhThuRes.data) {
                    const dtData = doanhThuRes.data;
                    
                    // Tính toán tổng tiền từng ca
                    const processedData = dtData.map(dt => ({
                        ...dt,
                        tong: (Number(dt.tienMat || 0) + Number(dt.tienCK || 0))
                    }));

                    // Sắp xếp & Lấy 7 ca cuối cho biểu đồ
                    const sorted = processedData.sort((a, b) => a.maDoanhThu.localeCompare(b.maDoanhThu));
                    const last7 = sorted.slice(-7).map(item => ({
                        day: item.maCa,
                        value: Math.round(item.tong / 1000)
                    }));
                    setChartData(last7);

                    // Tổng hợp các thẻ Stats
                    const summary = processedData.reduce((acc, curr) => {
                        acc.total += curr.tong;
                        acc.cash += Number(curr.tienMat || 0);
                        acc.transfer += Number(curr.tienCK || 0);
                        return acc;
                    }, { total: 0, cash: 0, transfer: 0 });
                    setStatsSummary(summary);
                }
            } catch (error) {
                console.error("Lỗi Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // 3. Logic tự động chuyển Banner
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const maxVal = useMemo(() => (chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 1), [chartData]);

    if (loading) return <div className="loading-screen">Đang tải dữ liệu Lado...</div>;

    return (
        <div className="dashboard-wrapper">
            <header className="dash-header">
                <div className="header-title-main">
                    <h1>Lado Coffee Dashboard</h1>
                    {/* <p>Chúc { || 'Người dùng'} một ngày làm việc hiệu quả!</p> */}
                </div>
                <div className="header-trend-icon">
                    <TrendingUp size={24} color="#4f46e5" />
                </div>
            </header>

            {/* --- PHẦN 1: BANNER CAROUSEL (Đã khôi phục) --- */}
            <section className="banner-carousel-section">
                <div className="carousel-track" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                    {banners.map((b) => (
                        <div key={b.id} className="carousel-item">
                            <img src={b.img} alt={b.title} />
                            <div className="banner-title-card">
                                <h2>{b.title}</h2>
                                <button className="banner-action-btn">Chi tiết</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="carousel-nav prev" onClick={() => setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)}>
                    <ChevronLeft size={24} />
                </button>
                <button className="carousel-nav next" onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}>
                    <ChevronRight size={24} />
                </button>
            </section>

            {/* --- PHẦN 2: THẺ THỐNG KÊ --- */}
            <section className="stats-cards-section">
                <div className="stat-card shadow-sm">
                    <div className="stat-icon-box bg-indigo"><DollarSign size={24} /></div>
                    <div className="stat-info-main">
                        <h3>{statsSummary.total.toLocaleString()}đ</h3>
                        <p>Tổng doanh thu</p>
                        <span className="stat-trend-tag trend-up">Thực tế</span>
                    </div>
                </div>
                <div className="stat-card shadow-sm">
                    <div className="stat-icon-box bg-emerald"><Banknote size={24} /></div>
                    <div className="stat-info-main">
                        <h3>{statsSummary.cash.toLocaleString()}đ</h3>
                        <p>Tiền mặt</p>
                    </div>
                </div>
                <div className="stat-card shadow-sm">
                    <div className="stat-icon-box bg-blue"><CreditCard size={24} /></div>
                    <div className="stat-info-main">
                        <h3>{statsSummary.transfer.toLocaleString()}đ</h3>
                        <p>Chuyển khoản</p>
                    </div>
                </div>
                <div className="stat-card shadow-sm">
                    <div className="stat-icon-box bg-rose"><Target size={24} /></div>
                    <div className="stat-info-main">
                        <h3>{chartData.length}</h3>
                        <p>Số ca ghi nhận</p>
                    </div>
                </div>
            </section>

            <div className="dash-bottom-grid">
                {/* --- PHẦN 3: BIỂU ĐỒ DOANH THU (Số luôn hiện) --- */}
                <section className="revenue-chart-section modern-card">
                    <div className="card-header">
                        <h2><BarChart3 size={20}/> Doanh thu ca (Đơn vị: 1.000đ)</h2>
                    </div>
                    <div className="chart-area-simulated">
                        {chartData.length > 0 ? chartData.map((d, i) => (
                            <div key={i} className="chart-bar-container">
                                <div className="chart-bar-value">{d.value.toLocaleString()}k</div>
                                <div className="chart-bar-pill" style={{ height: `${(d.value / maxVal) * 75}%` }}></div>
                                <div className="chart-bar-label">{d.day}</div>
                            </div>
                        )) : <p className="text-center w-100 p-5">Chưa có dữ liệu</p>}
                    </div>
                </section>

                {/* --- PHẦN 4: KHUYẾN MÃI --- */}
                <section className="promo-info-section modern-card">
                    <div className="card-header">
                        <h2><Ticket size={20}/> Khuyến mãi hiện hành</h2>
                    </div>
                    <div className="promo-list-dash">
                        {currentPromos.map(p => (
                            <div key={p.maKhuyenMai} className="promo-list-item-modern">
                                <div className="promo-icon-modern bg-indigo">🎁</div>
                                <div className="promo-info-modern">
                                    <p className="promo-name-dash">{p.tenKhuyenMai}</p>
                                    <p className="promo-sub-dash">Ưu đãi {p.giaTri}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;