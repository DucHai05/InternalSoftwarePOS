import React, { useState } from 'react';
import { loaiSanPhamApi } from '../../api/APIGateway';
import './loaiSanPhamForm.css';

const LoaiSanPhamForm = ({ isEdit, initialData, onClose, onRefresh }) => {
    // Khởi tạo state dựa trên dữ liệu truyền vào (Có sửa thì lấy data cũ, Không sửa thì tạo mã mới)
    const [formData, setFormData] = useState(initialData || { 
        maLoaiSanPham: 'LSP' + Date.now(), 
        tenLoaiSanPham: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await loaiSanPhamApi.update(formData.maLoaiSanPham, formData);
            } else {
                await loaiSanPhamApi.create(formData);
            }
            onRefresh(); // Gọi hàm load lại bảng của component cha
            onClose();   // Đóng Modal
        } catch (error) {
            console.error("Lỗi khi lưu loại sản phẩm:", error);
            alert("Đã xảy ra lỗi khi lưu!");
        }
    };
    return (
    <div className="lado-modal-overlay">
        <div className="lado-modal-content">
            <form onSubmit={handleSubmit}>
                <div className="lado-modal-header">
                    <h2>{isEdit ? 'Sửa Loại Sản Phẩm' : 'Thêm Loại Mới'}</h2>
                    <button type="button" className="btn-close-lado" onClick={onClose}>&times;</button>
                </div>

                <div className="lado-modal-body">
                    <div className="lado-form-group">
                        <label>Mã Loại (Tự động)</label>
                        <input 
                            type="text" 
                            className="lado-input" 
                            value={formData.maLoaiSanPham} 
                            disabled 
                        />
                    </div>
                    <div className="lado-form-group">
                        <label>Tên Loại Sản Phẩm</label>
                        <input 
                            type="text" 
                            className="lado-input" 
                            placeholder="Ví dụ: Cà phê, Đồ ăn vặt..."
                            value={formData.tenLoaiSanPham} 
                            onChange={e => setFormData({...formData, tenLoaiSanPham: e.target.value})} 
                            required 
                            autoFocus
                        />
                    </div>
                </div>

                <div className="lado-modal-footer">
                    <button type="button" className="btn-lado btn-lado-secondary" onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button type="submit" className="btn-lado btn-lado-primary">
                        {isEdit ? 'Lưu thay đổi' : 'Tạo loại mới'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default LoaiSanPhamForm;