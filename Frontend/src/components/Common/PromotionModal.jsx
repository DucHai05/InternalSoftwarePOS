import React from 'react';
import '../CommonCSS/promotionModal.css';

const PromotionModal = ({ isOpen, onClose, promos, onSelect }) => {
    // Nếu không mở thì không render gì cả
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="promo-modal">
                <div className="modal-header">
                    <h3>Chọn Khuyến Mãi</h3>
                    <button className="close-modal" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {promos && promos.length > 0 ? (
                        promos.map((p, idx) => (
                            <div 
                                key={p.maKhuyenMai || idx} 
                                className="promo-card-item" 
                                onClick={() => onSelect(p)}
                            >
                                <div className="promo-left">
                                    <div 
                                        className="promo-icon-box" 
                                        style={{ backgroundColor: p.mauSac || '#0ea5e9' }}
                                    >
                                        🎁
                                    </div>
                                    <div className="promo-content-box">
                                        <h4>{p.tenKhuyenMai}</h4>
                                        <span className="promo-badge-tag">
                                            Giảm {p.giaTri?.toLocaleString()}
                                            {p.loaiKhuyenMai === 'PERCENT' ? '%' : 'đ'}
                                        </span>
                                    </div>
                                </div>
                                <button className="promo-select-btn">Chọn</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            Không có khuyến mãi khả dụng
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromotionModal;