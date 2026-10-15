import React from 'react';
import '../CommonCSS/confirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, itemName, onCancel, onConfirm }) => {
    // Nếu không mở thì không render gì cả
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal-content">
                <div className="warning-icon">⚠️</div>
                <h3>Xác nhận hủy món</h3>
                
                <p>
                    Món <strong>{itemName}</strong> đã được gửi xuống bếp.
                </p>
                <p>Bạn có chắc chắn muốn hủy món này không?</p>
                
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Quay lại
                    </button>
                    <button className="btn-danger" onClick={onConfirm}>
                        Đồng ý hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;