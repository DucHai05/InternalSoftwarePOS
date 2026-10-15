import React, { useState, useEffect } from 'react';
import { khuVucApi } from '../../api/APIGateway';
import { 
  Map, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import './KhuVucManager.css';

const KhuVucManager = ({ onSelectKhuVuc }) => {
    const [khuVucs, setKhuVucs] = useState([]);
    const [selectedKhuVuc, setSelectedKhuVuc] = useState(null);
    const [formData, setFormData] = useState({
        maKhuVuc: '',
        tenKhuVuc: '',
        trangThai: 'Sẵn sàng'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchKhuVucs();
    }, []);

    const fetchKhuVucs = async () => {
        try {
            const response = await khuVucApi.getAll();
            setKhuVucs(response.data);
        } catch (error) {
            showMessage("Không thể tải danh sách khu vực", true);
        }
    };

    const showMessage = (msg, error = false) => {
        setMessage(msg);
        setIsError(error);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) return;
        if (!formData.maKhuVuc.trim() || !formData.tenKhuVuc.trim()) {
            showMessage("Mã và Tên không được để trống", true);
            return;
        }

        try {
            await khuVucApi.create(formData);
            showMessage("Thêm khu vực mới thành công");
            fetchKhuVucs();
            handleResetSelection();
        } catch (error) {
            showMessage("Mã khu vực này đã tồn tại!", true);
        }
    };

    const handleUpdate = async () => {
        if (!isEditing || !formData.tenKhuVuc.trim()) {
            showMessage("Tên khu vực không được để trống", true);
            return;
        }
        try {
            await khuVucApi.update(formData.maKhuVuc, formData);
            showMessage("Cập nhật thành công");
            fetchKhuVucs();
            setSelectedKhuVuc({ ...selectedKhuVuc, ...formData });
        } catch (error) {
            showMessage("Lỗi cập nhật dữ liệu", true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa khu vực này sẽ xóa toàn bộ bàn bên trong. Tiếp tục?")) {
            try {
                await khuVucApi.delete(id);
                fetchKhuVucs();
                showMessage("Đã xóa khu vực");
                handleResetSelection();
            } catch (error) {
                showMessage("Khu vực đang vận hành không thể xóa", true);
            }
        }
    };

    const handleSelectKhuVuc = (kv) => {
        setFormData({
            maKhuVuc: kv.maKhuVuc,
            tenKhuVuc: kv.tenKhuVuc,
            trangThai: kv.trangThai || 'Sẵn sàng'
        });
        setIsEditing(true);
        setSelectedKhuVuc(kv);
        if (onSelectKhuVuc) onSelectKhuVuc(kv);
    };

    const handleResetSelection = () => {
        setSelectedKhuVuc(null);
        setFormData({ maKhuVuc: '', tenKhuVuc: '', trangThai: 'Sẵn sàng' });
        setIsEditing(false);
        if (onSelectKhuVuc) onSelectKhuVuc(null);
    };

    return (
        <div className="kv-manager-wrapper">
            <header className="kv-header">
                <div className="kv-header-info">
                    <h1>Thiết lập Khu vực</h1>
                    <p>Quản lý các phân khu không gian trong cửa hàng</p>
                </div>
            </header>

            {/* MESSAGE TOAST */}
            {message && (
                <div className={`kv-toast ${isError ? 'error' : 'success'}`}>
                    {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    {message}
                </div>
            )}

            {/* FORM SECTION */}
            <div className="kv-form-card">
                <div className="kv-form-header">
                    <Layers size={20} />
                    <h3>{isEditing ? 'Chỉnh sửa thông tin' : 'Tạo khu vực mới'}</h3>
                </div>
                <form onSubmit={handleSubmit} className="kv-form">
                    <div className="kv-input-grid">
                        <div className="kv-input-group">
                            <label>Mã khu vực</label>
                            <input
                                type="text" placeholder="Ví dụ: KV01"
                                value={formData.maKhuVuc}
                                onChange={(e) => setFormData({ ...formData, maKhuVuc: e.target.value })}
                                disabled={isEditing} required
                            />
                        </div>
                        <div className="kv-input-group">
                            <label>Tên khu vực</label>
                            <input
                                type="text" placeholder="Ví dụ: Tầng trệt"
                                value={formData.tenKhuVuc}
                                onChange={(e) => setFormData({ ...formData, tenKhuVuc: e.target.value })}
                                required
                            />
                        </div>
                        <div className="kv-input-group">
                            <label>Trạng thái</label>
                            <select
                                value={formData.trangThai}
                                onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                            >
                                <option value="Sẵn sàng">Sẵn sàng</option>
                                <option value="Bảo trì">Bảo trì</option>
                                <option value="Tạm ngưng">Tạm ngưng</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="kv-form-actions">
                        {!isEditing ? (
                            <button type="submit" className="btn-kv-primary">
                                <Plus size={18} /> Thêm mới
                            </button>
                        ) : (
                            <>
                                <button type="button" className="btn-kv-update" onClick={handleUpdate}>
                                    <Edit3 size={18} /> Lưu cập nhật
                                </button>
                                <button type="button" className="btn-kv-delete" onClick={() => handleDelete(formData.maKhuVuc)}>
                                    <Trash2 size={18} /> Xóa
                                </button>
                                <button type="button" className="btn-kv-cancel" onClick={handleResetSelection}>
                                    <RotateCcw size={18} /> Hủy
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            {/* CARD GRID */}
            <div className="kv-card-grid">
                {khuVucs.length === 0 ? (
                    <div className="kv-empty-state">
                        <Map size={48} />
                        <p>Chưa có khu vực nào được tạo.</p>
                    </div>
                ) : (
                    khuVucs.map(kv => (
                        <div
                            key={kv.maKhuVuc}
                            className={`kv-item-card ${selectedKhuVuc?.maKhuVuc === kv.maKhuVuc ? 'selected' : ''}`}
                            onClick={() => handleSelectKhuVuc(kv)}
                        >
                            <div className="kv-card-content">
                                <span className="kv-code">{kv.maKhuVuc}</span>
                                <h4 className="kv-name">{kv.tenKhuVuc}</h4>
                                <div className={`kv-status-pill ${kv.trangThai === 'Sẵn sàng' ? 'ready' : kv.trangThai === 'Bảo trì' ? 'mainte' : 'pause'}`}>
                                    <span className="kv-dot"></span>
                                    {kv.trangThai}
                                </div>
                            </div>
                            <div className="kv-card-arrow">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default KhuVucManager;