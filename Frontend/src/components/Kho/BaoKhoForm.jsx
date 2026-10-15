import React, { useState } from 'react';
// Đã xóa bỏ import axios ở đây
import { employeeApi, notificationApi } from '../../api/APIGateway';
import './baoKhoForm.css';

const BaoKhoForm = ({ nguyenLieus, onClose }) => {
    const [baoKhoItems, setBaoKhoItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNguyenLieus = nguyenLieus.filter(nl =>
        nl.tenNguyenLieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nl.maNguyenLieu.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleBaoKhoItem = (nl) => {
        const isSelected = baoKhoItems.some(item => item.maNguyenLieu === nl.maNguyenLieu);
        if (isSelected) {
            setBaoKhoItems(baoKhoItems.filter(item => item.maNguyenLieu !== nl.maNguyenLieu));
        } else {
            setBaoKhoItems([...baoKhoItems, {
                maNguyenLieu: nl.maNguyenLieu,
                tenNguyenLieu: nl.tenNguyenLieu,
                tonKho: `Tồn kho: ${nl.soLuong} ${nl.donViTinh}`, 
                lyDo: '' 
            }]);
        }
    };

    const handleSelectAll = () => {
        if (baoKhoItems.length === filteredNguyenLieus.length && filteredNguyenLieus.length > 0) {
            setBaoKhoItems([]);
        } else {
            const allItems = filteredNguyenLieus.map(nl => ({
                maNguyenLieu: nl.maNguyenLieu,
                tenNguyenLieu: nl.tenNguyenLieu,
                tonKho: `Tồn kho: ${nl.soLuong} ${nl.donViTinh}`, 
                lyDo: '' 
            }));
            setBaoKhoItems(allItems);
        }
    };

    const handleChangeReason = (maNguyenLieu, newReason) => {
        setBaoKhoItems(baoKhoItems.map(item =>
            item.maNguyenLieu === maNguyenLieu ? { ...item, lyDo: newReason } : item
        ));
    };

    const handleSubmitAllBaoKho = async () => {
        if (baoKhoItems.length === 0) return;

        const token = localStorage.getItem('token'); 

        try {
            // 1. Gọi gọn gàng qua APIGateway
            const responseUser = await employeeApi.getAll(token);
            
            const danhSachQuanLy = responseUser.data
                .map(nv => nv.maNhanVien)
                .filter(ma => ma && ma.startsWith('QL'));

            if (danhSachQuanLy.length === 0) {
                alert("Không tìm thấy Quản lý nào trong hệ thống để gửi báo cáo!");
                return;
            }

            // Gộp nội dung
            const noiDungGop = baoKhoItems.map((item) => {
                const phanLyDo = item.lyDo.trim() !== '' ? ` - Ghi chú: ${item.lyDo}` : '';
                return `- ${item.tenNguyenLieu} (${item.tonKho})${phanLyDo}`;
            }).join('\n');
            
            // 2. Gửi thông báo gọn gàng qua APIGateway
            const promises = danhSachQuanLy.map(maQL => 
                notificationApi.create({
                    maNhanVien: maQL,
                    tieuDe: `Báo cáo kho (${baoKhoItems.length} nguyên liệu)`,
                    noiDung: noiDungGop,
                    loaiThongBao: 'KHO',
                    idThamChieu: null
                }, token)
            );

            await Promise.all(promises);

            alert(`Đã gửi báo cáo tự động tới ${danhSachQuanLy.length} Quản lý thành công!`);
            setBaoKhoItems([]);
            onClose(); 
        } catch (error) {
            console.error("Lỗi:", error);
            if (error.response?.status === 401) {
                alert("Phiên đăng nhập hết hạn! Vui lòng đăng xuất và đăng nhập lại.");
            } else {
                alert("Đã xảy ra lỗi kết nối hệ thống!");
            }
        }
    };

  return (
    <div className="bk-container">
        <div className="bk-card">
            <div className="bk-header">
                <h3>🔔 Tạo Báo Cáo Nguyên Liệu</h3>
                <span className="badge bg-danger">Món đã chọn: {baoKhoItems.length}</span>
            </div>

            <div className="bk-body">
                <div className="row">
                    <div className="col-md-5 border-end pe-4">
                        <div className="bk-column-title">1. Chọn nguyên liệu cần báo</div>
                        <input 
                            type="text" 
                            className="bk-search-input" 
                            placeholder="🔍 Tìm tên hoặc mã..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        
                        <div className="form-check mb-3 ms-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="selectAll" 
                                checked={baoKhoItems.length === filteredNguyenLieus.length && filteredNguyenLieus.length > 0} 
                                onChange={handleSelectAll} 
                            />
                            <label className="form-check-label fw-bold text-primary" htmlFor="selectAll" style={{ cursor: 'pointer' }}>
                                Chọn tất cả
                            </label>
                        </div>

                        <div className="bk-list-scroll">
                            {filteredNguyenLieus.length === 0 ? (
                                <div className="p-4 text-center text-muted">Không có dữ liệu</div>
                            ) : (
                                filteredNguyenLieus.map(nl => {
                                    const isLow = nl.soLuong <= (nl.nguongCanhBao ?? 10);
                                    const isChecked = baoKhoItems.some(item => item.maNguyenLieu === nl.maNguyenLieu);
                                    return (
                                        <label key={nl.maNguyenLieu} className={`bk-item-label ${isChecked ? 'selected' : ''}`}>
                                            <input 
                                                className="bk-checkbox" 
                                                type="checkbox" 
                                                checked={isChecked} 
                                                onChange={() => handleToggleBaoKhoItem(nl)} 
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div className="fw-bold" style={{ color: 'var(--slate-800)' }}>{nl.tenNguyenLieu}</div>
                                                <small className={isLow ? 'text-danger fw-bold' : 'text-muted'}>
                                                    Tồn: {nl.soLuong} {nl.donViTinh}
                                                </small>
                                            </div>
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="col-md-7 ps-4">
                        <div className="bk-column-title">2. Chi tiết nội dung gửi Quản lý</div>
                        <div className="bk-table-area">
                            {baoKhoItems.length === 0 ? (
                                <div className="bk-empty-state">
                                    <p>Chưa có nguyên liệu nào được chọn.<br/>Vui lòng tick chọn danh sách bên trái.</p>
                                </div>
                            ) : (
                                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                    <table className="bk-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40%' }}>Nguyên liệu</th>
                                                <th style={{ width: '60%' }}>Nội dung/Lý do</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {baoKhoItems.map((item) => (
                                                <tr key={item.maNguyenLieu}>
                                                    <td className="fw-bold text-primary">{item.tenNguyenLieu}</td>
                                                    <td>
                                                        <div className="mb-1 text-danger small fw-bold">{item.tonKho}</div>
                                                        <input 
                                                            type="text" 
                                                            className="bk-reason-input" 
                                                            placeholder="Nhập thêm ghi chú/lý do..."
                                                            value={item.lyDo} 
                                                            onChange={(e) => handleChangeReason(item.maNguyenLieu, e.target.value)} 
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bk-footer">
                <button type="button" className="btn-lado btn-back" onClick={onClose}>Quay lại</button>
                <button 
                    type="button" 
                    className="btn-lado btn-send" 
                    onClick={handleSubmitAllBaoKho} 
                    disabled={baoKhoItems.length === 0}
                >
                    🚀 Gửi Báo Cáo Cho Quản Lý
                </button>
            </div>
        </div>
    </div>
);
};
export default BaoKhoForm;