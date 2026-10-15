import React from 'react';
import '../CommonCSS/phanLoaiCard.css';
import promo3 from '../../assets/promo3.jpg';

const POSCard = ({ title, subtitle, image, onClick, type = 'product', isActive = false, disabled = false }) => {
    // Ảnh mặc định nếu món đó chưa có ảnh trong DB
    const defaultImg = promo3;

    return (
        <div 
            className={`p-card ${isActive ? 'active' : ''} ${type}-card`} 
            onClick={disabled ? undefined : onClick}
            aria-disabled={disabled}
        >
            {/* 1. Phần ảnh món ăn */}
            <div className="p-image-container">
                <img src={image || defaultImg} alt={title} className="p-food-img" />
                {/* Nút dấu cộng nhỏ xinh nằm đè lên ảnh hoặc góc thẻ */}
                <div className="p-add-badge">
                    {type === 'product' ? '+' : '→'}
                </div>
            </div>

            {/* 2. Phần thông tin tên và giá */}
            <div className="p-info">
                <h4 className="p-title">{title}</h4>
                <p className="p-price">{subtitle}</p>
            </div>
        </div>
    );
};

export default POSCard;
