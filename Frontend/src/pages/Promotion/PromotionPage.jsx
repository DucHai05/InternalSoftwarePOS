import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Plus, 
  Settings2, 
  Percent, 
  Database, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Palette,
  Type,
  FileText,
  Zap,
  Users, 
  ShoppingBag, 
  Coffee
} from 'lucide-react';
import EventPromoGrid from '../../components/Promotion/EventPromoGrid';
import PromoTypeTable from '../../components/Promotion/PromoTypeTable';
import PromotionModal from '../../components/Promotion/PromotionModal';
import './promotionPage.css';
import { promoApi } from '../../api/APIGateway';


const PromotionPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('event');
    const [categories, setCategories] = useState([]);
    // --- STATE CHO MODAL CRUD ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    const [formData, setFormData] = useState({
        tenKhuyenMai: '',
        moTa: '',
        giaTri: 0,
        loaiKhuyenMai: 'PERCENT',
        mauSac: '#4f46e5',
        loaiDoiTuong: 'ALL',
        giaTriDonToiThieu: 0,
        apDungChoMon: 'ALL'
    });

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const res = await promoApi.getAllPromos();
            setPromotions(res.data);
        } catch (err) {
            console.error("Lỗi gọi API:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPromotions(); }, []);

    // --- CÁC HÀM XỬ LÝ CRUD ---
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ 
            tenKhuyenMai: '', 
            moTa: '', 
            giaTri: 0, 
            loaiKhuyenMai: 'PERCENT', 
            mauSac: '#4f46e5', 
            loaiDoiTuong: activeTab === 'event' ? 'ALL' : 'SELECTIVE',
            giaTriDonToiThieu: 0,
            apDungChoMon: 'ALL'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (p) => {
        setEditingId(p.maKhuyenMai); // Giữ lại ID để biết đang sửa mã nào
        const firstConfig = p.configs?.[0] || {};
        
        setFormData({
            // maKhuyenMai: p.maKhuyenMai, <-- XÓA (Không cần quản lý mã trong form nữa)
            tenKhuyenMai: p.tenKhuyenMai,
            moTa: p.moTa,
            giaTri: p.giaTri,
            loaiKhuyenMai: p.loaiKhuyenMai,
            mauSac: p.mauSac || '#4f46e5',
            loaiDoiTuong: firstConfig.loaiDoiTuong || 'ALL',
            giaTriDonToiThieu: firstConfig.giaTriDonToiThieu || 0,
            apDungChoMon: firstConfig.apDungChoMon || 'ALL'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
    e.preventDefault();
    
    // Tạo bản sao dữ liệu, nếu là thêm mới thì bỏ maKhuyenMai ra
    const payload = {
                tenKhuyenMai: formData.tenKhuyenMai,
                moTa: formData.moTa,
                giaTri: Number(formData.giaTri),
                loaiKhuyenMai: formData.loaiKhuyenMai,
                mauSac: formData.mauSac,
                trangThai: true,
                configs: [{ 
                    loaiDoiTuong: formData.loaiDoiTuong,
                    giaTriDonToiThieu: Number(formData.giaTriDonToiThieu),
                    apDungChoMon: formData.apDungChoMon 
                }]
            };

            // Nếu đang sửa thì mới cần đính kèm mã để Backend biết sửa ông nào
            if (editingId) {
                payload.maKhuyenMai = editingId;
            }

            try {
                if (editingId) {
                    await promoApi.updatePromo(editingId, payload);
                } else {
                    await promoApi.createPromo(payload);
                }
                setIsModalOpen(false);
                fetchPromotions();
            } catch (err) { 
                alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu!")); 
            }
        };

    const handleDelete = async (id) => {
        if (window.confirm(`Xác nhận xóa mã ${id}?`)) {
            try {
                await promoApi.deletePromo(id);
                fetchPromotions();
            } catch (err) { alert("Không thể xóa!"); }
        }
    };

    const handleToggle = async (id) => {
            // BƯỚC 1: Cho cái Toggle nhảy ngay lập tức trên màn hình
            setPromotions(prev => prev.map(p => 
                p.maKhuyenMai === id ? { ...p, trangThai: !p.trangThai } : p
            ));

            try {
                await promoApi.updateStatus(id);
            } catch (err) {
                alert("Lỗi cập nhật!");
                // Nếu lỗi thì mới gọi fetch để trả lại trạng thái cũ
                fetchPromotions(); 
            }
        };

    if (loading) return (
        <div className="promo-loading-full">
            <Loader2 className="spin-icon" size={48} />
            <p>Đang tải dữ liệu khuyến mãi...</p>
        </div>
    );

    const eventPromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL'));
    const typePromos = promotions.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'));

    return (
        <div className="promo-container">
            {/* HEADER */}
            <div className="promo-header">
                <div className="header-left">
                    <h1>Quản lý Khuyến mãi</h1>
                    <p className="subtitle"></p>
                </div>
                <button className="add-promo-btn" onClick={openAddModal}>
                    <Plus size={20} /> Tạo mới
                </button>
            </div>

            {/* TABS SEGMENTED */}
            <div className="promo-tabs">
                <button className={activeTab === 'event' ? 'active' : ''} onClick={() => setActiveTab('event')}>
                    <Gift size={18} /> Sự kiện hệ thống ({eventPromos.length})
                </button>
                <button className={activeTab === 'type' ? 'active' : ''} onClick={() => setActiveTab('type')}>
                    <Zap size={18} /> Ưu đãi chọn tay ({typePromos.length})
                </button>
            </div>

            {/* CONTENT */}
            <div className="promo-content">
                {activeTab === 'event' ? (
                    <EventPromoGrid data={eventPromos} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ) : (
                    <PromoTypeTable data={typePromos} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>

           <PromotionModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            editingId={editingId}
            />


        </div>
    );
};

export default PromotionPage;