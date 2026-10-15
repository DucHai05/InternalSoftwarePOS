import React, { useState, useEffect } from 'react';
import '../CommonCSS/cartItem.css';

const CartItem = ({ item, idx, onRemove, onClick, onUpdateQty }) => {
    const [tempQty, setTempQty] = useState(item.soLuong);

    useEffect(() => {
        setTempQty(item.soLuong);
    }, [item.soLuong]);

    const handleQtyChange = (e) => {
        e.stopPropagation();
        const val = e.target.value;
        setTempQty(val); 

        const newQty = parseInt(val);
        if (!isNaN(newQty) && newQty > 0) {
            onUpdateQty(idx, newQty);
        }
    };

    const handleBlur = () => {
        if (tempQty === "" || parseInt(tempQty) <= 0) {
            setTempQty(1);
            onUpdateQty(idx, 1);
        }
    };

    return (
        <div className="cart-item-row" onClick={() => onClick(idx)}>
            {/* Cột thông tin: Tên và Ghi chú xếp chồng */}
            <div className="col-info">
                <span className="item-name">{item.tenSanPham}</span>
                {item.ghiChu && (
                    <span className="item-note">{item.ghiChu}</span>
                )}
            </div>

            {/* Cột số lượng */}
            <div className="col-qty" onClick={(e) => e.stopPropagation()}>
                <input
                    type="number"
                    className="qty-input"
                    value={tempQty}
                    onChange={handleQtyChange}
                    onBlur={handleBlur}
                    min="1"
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* Cột thành tiền */}
            <div className="col-price">
                {(item.giaBan * (parseInt(tempQty) || 0)).toLocaleString()}đ
            </div>

            {/* Nút xóa */}
            <div className="col-actions">
                <button 
                    className="remove-btn" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(idx);
                    }}
                >✕</button>
            </div>
        </div>
    );
};

export default CartItem;