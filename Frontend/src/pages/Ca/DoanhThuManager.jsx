import React, { useState, useEffect } from 'react';
import { phieuThuChiApi } from '../../api/APIGateway';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  ClipboardList, 
  DollarSign, 
  X, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './DoanhThuManager.css';

const DoanhThuManager = ({ ca, onRefreshCa }) => {
    const [phieuThu, setPhieuThu] = useState([]);
    const [phieuChi, setPhieuChi] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [phieuForm, setPhieuForm] = useState({ soTien: '', moTa: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ca?.maCa) fetchPhieu();
    }, [ca]);

    const fetchPhieu = async () => {
        try {
            const response = await phieuThuChiApi.getByCa(ca.maCa);
            const all = response.data || [];
            setPhieuThu(all.filter((item) => item.loaiPhieu === 'Thu'));
            setPhieuChi(all.filter((item) => item.loaiPhieu === 'Chi'));
        } catch (error) {
            console.error('Lỗi khi tải phiếu', error);
        }
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
        setPhieuForm({ soTien: '', moTa: '' });
    };

    const handleSavePhieu = async () => {
        if (!phieuForm.soTien || !phieuForm.moTa.trim()) {
            alert('Vui lòng nhập đầy đủ số tiền và lý do');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                soTien: parseFloat(phieuForm.soTien),
                ghiChu: phieuForm.moTa.trim(),
                maCa: ca.maCa,
                loaiPhieu: modalType === 'thu' ? 'Thu' : 'Chi'
            };

            await phieuThuChiApi.create(payload);
            await fetchPhieu();
            if (onRefreshCa) await onRefreshCa();
            setModalOpen(false);
        } catch (error) {
            alert('Lỗi khi lưu phiếu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    return (
        <div className="doanhthu-wrapper">
            {/* QUICK ACTIONS SECTION */}
            <div className="action-cards-grid">
                <div className="action-card thu" onClick={() => handleOpenModal('thu')}>
                    <div className="action-icon"><TrendingUp size={24} /></div>
                    <div className="action-info">
                        <h3>Phiếu Thu</h3>
                        <p>{phieuThu.length} phiếu đã tạo</p>
                        <span className="add-label"><PlusCircle size={14} /> Tạo phiếu thu</span>
                    </div>
                </div>

                <div className="action-card chi" onClick={() => handleOpenModal('chi')}>
                    <div className="action-icon"><TrendingDown size={24} /></div>
                    <div className="action-info">
                        <h3>Phiếu Chi</h3>
                        <p>{phieuChi.length} phiếu đã tạo</p>
                        <span className="add-label"><PlusCircle size={14} /> Tạo phiếu chi</span>
                    </div>
                </div>
            </div>

            {/* LIST SECTION */}
            <div className="receipt-activity-grid">
                {/* Column Thu */}
                <div className="activity-column">
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
                </div>

                {/* Column Chi */}
                <div className="activity-column">
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
                </div>
            </div>

            {/* MODAL THÊM PHIẾU */}
            {modalOpen && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal-content">
                        <button className="close-x" onClick={() => setModalOpen(false)}><X size={20}/></button>
                        
                        <div className="modal-header">
                            <div className={`modal-icon ${modalType}`}>
                                {modalType === 'thu' ? <TrendingUp size={28}/> : <TrendingDown size={28}/>}
                            </div>
                            <div className="modal-header-text">
                                <h3>Lập phiếu {modalType === 'thu' ? 'Thu tiền' : 'Chi tiền'}</h3>
                                <p>Vui lòng nhập chính xác số tiền và lý do thực hiện.</p>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modern-form-group">
                                <label>Số tiền (VND)</label>
                                <div className="input-with-symbol">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        value={phieuForm.soTien}
                                        onChange={(e) => setPhieuForm({ ...phieuForm, soTien: e.target.value })}
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="modern-form-group">
                                <label>Lý do / Ghi chú</label>
                                <textarea
                                    value={phieuForm.moTa}
                                    onChange={(e) => setPhieuForm({ ...phieuForm, moTa: e.target.value })}
                                    placeholder="Ví dụ: Thu tiền khách nợ, Chi tiền mua đá viên..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel-ghost" onClick={() => setModalOpen(false)}>Hủy bỏ</button>
                            <button className={`btn-submit-action ${modalType}`} onClick={handleSavePhieu} disabled={loading}>
                                {loading ? 'Đang xử lý...' : `Xác nhận lập phiếu`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoanhThuManager;
