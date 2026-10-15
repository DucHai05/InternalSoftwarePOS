import React, { useState, useEffect } from 'react';
import { tableApi } from '../../api/APIGateway';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Layout, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import './BanManager.css';

const BanManager = ({ khuVuc }) => {
    const [bans, setBans] = useState([]);
    const [formData, setFormData] = useState({
        maBan: '',
        tenBan: '',
        trangThaiBan: 'Hoạt động'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const showMessage = (msg, error = false) => {
        setMessage(msg);
        setIsError(error);
        setTimeout(() => setMessage(''), 3000);
    };

    useEffect(() => {
        if (khuVuc && khuVuc.maKhuVuc) {
            setBans([]);
            fetchBans();
            setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
            setIsEditing(false);
        }
    }, [khuVuc]);

    const fetchBans = async () => {
        if (!khuVuc || !khuVuc.maKhuVuc) return;
        setLoading(true);
        try {
            const response = await tableApi.getBanByKhuVuc(khuVuc.maKhuVuc);
            setBans(response.data);
        } catch (error) {
            showMessage("Không thể tải danh sách bàn", true);
        } finally {
            setLoading(false);
        }
    };

    if (!khuVuc) {
        return (
            <div className="empty-state">
                <Layout size={48} color="#cbd5e1" />
                <h3>Chọn khu vực quản lý</h3>
                <p>Vui lòng chọn một khu vực từ danh sách bên trái để xem danh sách bàn.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, maKhuVuc: khuVuc.maKhuVuc };

        try {
            if (isEditing) {
                await tableApi.updateBan(formData.maBan, payload);
                showMessage("Cập nhật bàn thành công!");
            } else {
                await tableApi.createBan(payload);
                showMessage("Thêm bàn mới thành công!");
            }
            fetchBans();
            setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
            setIsEditing(false);
        } catch (error) {
            showMessage(error.response?.data?.message || "Lỗi thao tác dữ liệu", true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Xác nhận xóa bàn ${id}?`)) {
            try {
                await tableApi.deleteBan(id);
                fetchBans();
                showMessage("Xoá bàn thành công!");
            } catch (error) {
                showMessage("Lỗi khi xoá bàn", true);
            }
        }
    };

    return (
        <div className="manager-wrapper">
            {/* HEADER SECTION */}
            <div className="manager-header">
                <div className="header-info">
                    <h2>Quản lý bàn</h2>
                    <p>Khu vực: <span>{khuVuc.tenKhuVuc}</span></p>
                </div>
                <button className="btn-refresh" onClick={fetchBans}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} /> Làm mới
                </button>
            </div>

            {/* ALERT MESSAGE */}
            {message && (
                <div className={`toast-message ${isError ? 'error' : 'success'}`}>
                    {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    {message}
                </div>
            )}

            {/* FORM CARD */}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Mã bàn</label>
                        <input
                            type="text" placeholder="Mã bàn tự động"
                            value={formData.maBan}
                            onChange={(e) => setFormData({ ...formData, maBan: e.target.value })}
                            disabled required
                        />
                    </div>
                    <div className="input-group">
                        <label>Tên bàn</label>
                        <input
                            type="text" placeholder="   Bàn 1"
                            value={formData.tenBan}
                            onChange={(e) => setFormData({ ...formData, tenBan: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Trạng thái</label>
                        <select
                            value={formData.trangThaiBan}
                            onChange={(e) => setFormData({ ...formData, trangThaiBan: e.target.value })}
                        >
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Bảo trì">Bảo trì</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {isEditing ? <Pencil size={18} /> : <PlusCircle size={18} />}
                            {isEditing ? 'Cập nhật' : 'Thêm bàn'}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn-ghost" onClick={() => {
                                setIsEditing(false);
                                setFormData({ maBan: '', tenBan: '', trangThaiBan: 'Hoạt động' });
                            }}>Hủy</button>
                        )}
                    </div>
                </form>
            </div>


            <div className="table-card">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Mã bàn</th>
                            <th>Tên hiển thị</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bans.map(ban => (
                            <tr 
                                key={ban.maBan} 
                                className="clickable-row" // Thêm class để CSS riêng
                                onClick={() => {
                                    setFormData(ban);
                                    setIsEditing(true);
                                }}
                            >
                                <td className="font-bold">{ban.maBan}</td>
                                <td>{ban.tenBan}</td>
                                <td>
                                    <span className={`badge ${ban.trangThaiBan === 'Hoạt động' ? 'status-active' : 'status-maintenance'}`}>
                                        <span className="dot"></span>
                                        {ban.trangThaiBan}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {/* Nút sửa - Không cần stopPropagation vì nó cùng hành động với dòng */}
                                    <button className="action-btn edit">
                                        <Pencil size={16} />
                                    </button>
                                    
                                    {/* Nút xóa - BẮT BUỘC có stopPropagation */}
                                    <button 
                                        className="action-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn việc kích hoạt onClick của <tr>
                                            handleDelete(ban.maBan);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>  
        </div>
    );
};

export default BanManager;
