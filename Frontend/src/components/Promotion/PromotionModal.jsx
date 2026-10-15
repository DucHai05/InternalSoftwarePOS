import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings2, X, Palette, Type, 
  Percent, FileText, Users, Coffee, ShoppingBag 
} from 'lucide-react';
import { productApi } from '../../api/APIGateway'; 
import './promotionModal.css';

const PromotionModal = ({ isOpen, onClose, formData, setFormData, onSave, editingId }) => {
  if (!isOpen) return null;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Gọi API lấy loại sản phẩm (giả sử bạn import productApi từ APIGateway)
                const res = await productApi.getLoaiSP(); // Hoặc axios.get trực tiếp
                setCategories(res.data);
            } catch (err) {
                console.error("Không thể lấy danh sách loại sản phẩm", err);
            }
        };
        if (isOpen) fetchCategories();
    }, [isOpen]);

 return (
    <div className="modal-overlay">
      <div className="promo-modal-crud">
        {/* --- HEADER --- */}
        <div className="modal-header-crud">
          <div className="header-title-flex">
            <Settings2 size={22} color="#4f46e5" />
            <h2>{editingId ? 'Cập nhật ưu đãi' : 'Thiết lập ưu đãi mới'}</h2>
          </div>
          <button className="close-x" onClick={onClose}><X size={20}/></button>
        </div>
        
        <form onSubmit={onSave}>
          <div className="modal-body-crud">
            
            {/* --- PHẦN 1: THÔNG TIN CƠ BẢN --- */}
            <div className="section-divider">Thông tin cơ bản</div>
            
            <div className="form-row-crud">
              <div className="form-group">
                <label><Palette size={14}/> Màu thương hiệu</label>
                <input 
                  type="color" 
                  value={formData.mauSac || '#4f46e5'} 
                  onChange={e => setFormData({...formData, mauSac: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label><Users size={14}/> Loại hình áp dụng</label>
                <select 
                  value={formData.loaiDoiTuong} 
                  onChange={e => setFormData({...formData, loaiDoiTuong: e.target.value})}
                >
                  <option value="ALL">Hệ thống (Tự động áp dụng)</option>
                  <option value="SELECTIVE">Chọn tay (Nhân viên chọn)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label><Type size={14}/> Tên chương trình</label>
              <input 
                type="text" 
                required 
                value={formData.tenKhuyenMai} 
                onChange={e => setFormData({...formData, tenKhuyenMai: e.target.value})} 
                placeholder="VD: Giảm giá mùa hè..." 
              />
            </div>

            <div className="form-row-crud">
              <div className="form-group">
                <label><Percent size={14}/> Giá trị giảm</label>
                <input 
                  type="number" 
                  required 
                  value={formData.giaTri} 
                  onChange={e => setFormData({...formData, giaTri: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Đơn vị</label>
                <select 
                  value={formData.loaiKhuyenMai} 
                  onChange={e => setFormData({...formData, loaiKhuyenMai: e.target.value})}
                >
                  <option value="PERCENT">Phần trăm (%)</option>
                  <option value="FIXED_AMOUNT">Số tiền (VNĐ)</option>
                </select>
              </div>
            </div>

            {/* --- PHẦN 2: ĐIỀU KIỆN ÁP DỤNG --- */}
            <div className="section-divider">Cấu hình áp dụng</div>

            <div className="form-row-crud">
              <div className="form-group">
                <label><Coffee size={14}/> Loại sản phẩm áp dụng</label>
                <select 
                  value={formData.apDungChoMon} 
                  onChange={e => setFormData({...formData, apDungChoMon: e.target.value})}
                >
                  <option value="ALL">Tất cả món</option>
                  {categories.map(cat => (
                    <option key={cat.maLoaiSanPham} value={cat.maLoaiSanPham}>
                      {cat.tenLoaiSanPham}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chỉ hiện Đơn hàng tối thiểu khi là loại Tự động */}
              {formData.loaiDoiTuong === 'ALL' && (
                <div className="form-group">
                  <label><ShoppingBag size={14}/> Đơn hàng tối thiểu (VNĐ)</label>
                  <input 
                    type="number" 
                    value={formData.giaTriDonToiThieu} 
                    onChange={e => setFormData({...formData, giaTriDonToiThieu: e.target.value})} 
                    placeholder="Ví dụ: 50000"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label><FileText size={14}/> Mô tả chi tiết</label>
              <textarea 
                rows="3" 
                value={formData.moTa} 
                onChange={e => setFormData({...formData, moTa: e.target.value})} 
                placeholder="Mô tả nội dung khuyến mãi..." 
              />
            </div>
          </div>

          {/* --- FOOTER --- */}
          <div className="modal-footer-crud">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary-save">Xác nhận Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionModal;