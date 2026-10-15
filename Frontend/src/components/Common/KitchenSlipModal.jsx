import React from 'react';
import { Printer, X, Clock, User, Hash, LayoutGrid } from 'lucide-react'; 
import '../CommonCSS/kitchenSlipModal.css';

const KitchenSlipModal = ({ isOpen, onClose, nameTable, cart, onConfirm, maHoaDon }) => {
    if (!isOpen) return null;

    const slipMessage = item => item.slipNote || item.ghiChu;
    const isAdjusting = cart.some(item => slipMessage(item)?.includes("HỦY") || slipMessage(item)?.includes("THÊM"));
    const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('vi-VN');
    const tenNV = localStorage.getItem('tenNhanVien') || 'Nhân viên';

    return (
        <div className="modal-overlay">
            <div className="kitchen-slip-wrapper">
                <div className="kitchen-paper">
                    <div className="paper-edge-top"></div>

                    <div className="slip-content">
                        <header className="slip-header">
                            <div className="brand-mini">LADO COFFEE</div>
                            <h2>PHIẾU CHẾ BIẾN</h2>
                            <div className={`slip-badge ${isAdjusting ? 'adjust' : 'new'}`}>
                                {isAdjusting ? 'ĐIỀU CHỈNH ĐƠN' : 'ĐƠN MỚI'}
                            </div>
                        </header>

                        {/* Thông tin định danh: Gọn gàng và bằng size nhau */}
                        <div className="slip-metadata">
                            <div className="meta-item">
                                <Hash size={14} /> <span>Mã đơn: <strong>{maHoaDon || '---'}</strong></span>
                            </div>
                            <div className="meta-item">
                                <LayoutGrid size={14} /> <span>Bàn: <strong>{nameTable}</strong></span>
                            </div>
                            <div className="meta-item">
                                <User size={14} /> <span>Nhân viên: <strong>{tenNV}</strong></span>
                            </div>
                            <div className="meta-item">
                                <Clock size={14} /> <span>Thời gian: {currentTime} - {currentDate}</span>
                            </div>
                        </div>

                        <div className="slip-divider">**************************</div>

                        <div className="slip-body">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th align="left">Tên món</th>
                                        <th align="right">SL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, i) => (
                                        <tr key={i} className={slipMessage(item)?.includes("HỦY") ? 'item-cancel' : ''}>
                                            <td>
                                                <div className="item-name">{item.tenSanPham || item.tenMon}</div>
                                                {slipMessage(item) && <span className="item-note">[{slipMessage(item)}]</span>}
                                            </td>
                                            <td align="right" className="item-qty">x{item.soLuong}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="slip-divider">**************************</div>
                        {/* Đã bỏ phần Footer và câu lệnh chế biến */}
                    </div>

                    <div className="paper-edge-bottom"></div>
                </div>

                <div className="slip-actions">
                    <button className="btn-confirm-print" onClick={onConfirm}>
                        <Printer size={20} /> XÁC NHẬN IN
                    </button>
                    <button className="btn-cancel-slip" onClick={onClose}>
                        <X size={18} /> ĐÓNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KitchenSlipModal;