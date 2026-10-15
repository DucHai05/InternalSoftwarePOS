// src/utils/cartHelpers.js

/**
 * Tính tổng tiền hàng (chưa giảm giá)
 */
export const calculateSubTotal = (cart) => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => sum + (item.giaBan * item.soLuong), 0);
};

/**
 * Tính giá trị được giảm của một chương trình KM
 */
export const calculateDiscountValue = (promo, amount) => {
    if (!promo || !amount) return 0;
    
    // Nếu là giảm theo %
    if (promo.loaiKhuyenMai === 'PERCENT') {
        return (amount * promo.giaTri) / 100;
    }
    
    // Nếu là giảm theo số tiền cố định (AMOUNT)
    return promo.giaTri;
};

/**
 * Tính tổng tiền cuối cùng sau khi trừ hết các loại giảm giá
 */
export const calculateFinalTotal = (subTotal, autoDiscountVal, manualDiscountVal) => {
    const total = subTotal - autoDiscountVal - manualDiscountVal;
    return total > 0 ? total : 0; // Đảm bảo không bị âm tiền
};