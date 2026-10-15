import React, { useState } from 'react'; // Thêm useState
import '../CommonCSS/receiptModal.css';

const ReceiptModal = ({ 
    isOpen, onClose, nameTable, maBan, nameStaff, cart, subTotal, 
    autoDiscount, autoDiscountVal, 
    manualDiscount, manualDiscountVal, 
    totalAmount, maHoaDon, onConfirm 
}) => {
    // 1. Khai báo state để chọn phương thức thanh toán (Mặc định là Tiền mặt)
    const [paymentMethod, setPaymentMethod] = useState('CASH');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="receipt-paper">
                <div className="receipt-header"><h2>PHIẾU TẠM TÍNH</h2></div>
                <div className="receipt-body">
                <div className="receipt-info">
                    <div className="info-row">
                        <span>Mã HD: <strong>{maHoaDon || `#HAI${Date.now().toString().slice(-5)}`}</strong></span>
                        <span>TN: <strong>{nameStaff}</strong></span>
                    </div>
                    <div className="info-row">
                        <span>Bàn: <strong>{nameTable}</strong></span>
                        <span>Ngày: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></span>
                    </div>
                </div>

                <table className="receipt-table">
                    <thead>
                        <tr><th>STT</th><th>Món</th><th>SL</th><th className="text-right">T.Tiền</th></tr>
                    </thead>
                    <tbody>
                        {cart.map((item, i) => (
                            <tr key={`${item.maSanPham}-${i}`}>
                                <td>{i + 1}</td>
                                <td>
                                    <div>{item.tenSanPham}</div>
                                    {item.ghiChu && <div style={{ fontSize: '12px', color: '#666' }}>— {item.ghiChu}</div>}
                                </td>
                                <td>{item.soLuong}</td>
                                <td className="text-right">{(item.giaBan * item.soLuong).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="receipt-divider"></div>

                {/* 2. KHU VỰC CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <div className="payment-selection">
                    <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>Hình thức thanh toán:</p>
                    <div className="radio-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input 
                                type="radio" 
                                name="payMethod" 
                                value="CASH" 
                                checked={paymentMethod === 'CASH'} 
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            /> Tiền mặt
                        </label>
                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input 
                                type="radio" 
                                name="payMethod" 
                                value="TRANSFER" 
                                checked={paymentMethod === 'TRANSFER'} 
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            /> Chuyển khoản
                        </label>
                    </div>
                </div>

                <div className="receipt-summary">
                    <div className="summary-row">
                        <span>Thành tiền:</span>
                        <span>{subTotal.toLocaleString()} đ</span>
                    </div>
                    {autoDiscountVal > 0 && (
                        <div className="summary-row">
                            <span>Ưu đãi ({autoDiscount?.tenKhuyenMai}):</span>
                            <span>-{autoDiscountVal.toLocaleString()} đ</span>
                        </div>
                    )}
                    {manualDiscountVal > 0 && (
                        <div className="summary-row">
                            <span>Voucher ({manualDiscount?.tenKhuyenMai}):</span>
                            <span>-{manualDiscountVal.toLocaleString()} đ</span>
                        </div>
                    )}
                    <div className="summary-row total">
                        <span>TỔNG TIỀN:</span>
                        <span>{totalAmount.toLocaleString()} đ</span>
                    </div>
                </div>

                <div className="receipt-footer">
                    {/* 3. CHỈ HIỆN QR KHI CHỌN CHUYỂN KHOẢN */}
                    {paymentMethod === 'TRANSFER' && (
                        <div style={{ textAlign: 'center', margin: '15px 0' }}>
                            <img 
                                src={`https://img.vietqr.io/image/MB-0383572217-compact2.png?amount=${totalAmount}&addInfo=Thanh toan ban ${maBan}`} 
                                alt="VietQR" 
                                style={{ width: '150px', borderRadius: '8px' }} 
                            />
                            <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>Chủ TK: BUI DUC HAI (MB Bank)</p>
                        </div>
                    )}
                    <p>SABO COFFEE</p>
                </div>

                <div className="receipt-actions">
                    {/* Khi confirm, Hải có thể truyền thêm paymentMethod vào để Backend lưu lại */}
                    <button className="btn-print" onClick={() => onConfirm(paymentMethod)}>XÁC NHẬN THANH TOÁN</button>
                    <button className="btn-close" onClick={onClose}>QUAY LẠI</button>
                </div>
              </div>
            </div>
        </div>
    );
};

export default ReceiptModal;