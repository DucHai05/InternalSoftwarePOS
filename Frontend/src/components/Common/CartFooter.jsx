import React from 'react';
import '../CommonCSS/cartFooter.css';

const CartFooter = ({ 
    autoDiscount, 
    autoDiscountVal, 
    manualDiscount, 
    manualDiscountVal, 
    totalAmount, 
    onConfirm, 
    onPayment, 
    onMerge, 
    onDelete,
    disabled = false
}) => {
    return (
        <div className="cart-footer">
            {autoDiscountVal > 0 && (
                <div className="discount-summary auto">
                    <span>✨ Ưu đãi ({autoDiscount?.tenKhuyenMai}):</span>
                    <span>-{autoDiscountVal.toLocaleString()}đ</span>
                </div>
            )}

            {/* Hiển thị giảm giá thủ công (Voucher) */}
            {manualDiscountVal > 0 && (
                <div className="discount-summary selective">
                    <span>🎫 Voucher ({manualDiscount?.tenKhuyenMai}):</span>
                    <span>-{manualDiscountVal.toLocaleString()}đ</span>
                </div>
            )}

            {/* Dòng tổng cộng */}
            <div className="total-row">
                <span>Tổng cộng:</span>
                <span className="total-price">{totalAmount.toLocaleString()}đ</span>
            </div>

            {/* Lưới các nút chức năng */}
           <div className="button-grid">
            <button className="action-btn confirm" disabled={disabled} onClick={onConfirm}>XÁC NHẬN</button>
            <button className="action-btn payment" disabled={disabled} onClick={onPayment}>THANH TOÁN</button>
            <button className="action-btn merge" disabled={disabled} onClick={onMerge}>GỘP BÀN</button>
            <button className="action-btn delete" disabled={disabled} onClick={onDelete}>HỦY ĐƠN</button>
          </div>
          
        </div>
    );
};

export default CartFooter;
