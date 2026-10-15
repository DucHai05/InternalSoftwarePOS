import React, { useState } from 'react';
import { productApi } from '../../api/APIGateway';
import './sanPhamForm.css';

const SanPhamForm = ({ isEditing, initialData, initialCongThuc, khoNguyenLieu, loaiSanPhams, onClose, onRefresh }) => {
    const [formData, setFormData] = useState(initialData || {
        maSanPham: 'SP' + Date.now(), 
        tenSanPham: '', 
        donGia: '', 
        maLoaiSanPham: loaiSanPhams.length > 0 ? loaiSanPhams[0].maLoaiSanPham : '',
        trangThai: 'Đang bán', 
        duongDanHinh: ''
    });

    const [congThuc, setCongThuc] = useState(initialCongThuc || []); 
    const [nlTempt, setNlTempt] = useState({ 
        maNguyenLieu: khoNguyenLieu.length > 0 ? khoNguyenLieu[0].maNguyenLieu : '', 
        soLuong: 1 
    });

    // HÀM UPLOAD ẢNH
    const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
        const response = await productApi.upload(uploadFormData);
        
        // Đảm bảo URL ảnh có đầy đủ http://localhost:8087
        const imageUrl = response.data.startsWith('http') 
            ? response.data 
            : `http://localhost:8087${response.data}`;
            
        setFormData(prev => ({ ...prev, duongDanHinh: imageUrl }));
    } catch (error) {
        console.error("Lỗi upload:", error);
        alert("Lỗi khi tải ảnh lên máy chủ (Cổng 8087)!");
    }
};

    // THÊM NGUYÊN LIỆU VÀO CÔNG THỨC
    const themNguyenLieuVaoCongThuc = () => {
        if (!nlTempt.maNguyenLieu || nlTempt.soLuong <= 0) return alert("Vui lòng chọn NL và nhập số lượng > 0");
        const isExist = congThuc.find(ct => ct.maNguyenLieu === nlTempt.maNguyenLieu);
        if (isExist) return alert("Nguyên liệu này đã có trong công thức!");

        const nlInfo = khoNguyenLieu.find(nl => nl.maNguyenLieu === nlTempt.maNguyenLieu);
        setCongThuc([...congThuc, {
            maNguyenLieu: nlInfo.maNguyenLieu,
            tenNguyenLieu: nlInfo.tenNguyenLieu,
            soLuong: nlTempt.soLuong,
            donViTinh: nlInfo.donViTinh
        }]);
    };

    // XÓA NGUYÊN LIỆU KHỎI CÔNG THỨC
    const xoaNguyenLieuKhoiCongThuc = (maNguyenLieu) => {
        setCongThuc(congThuc.filter(c => c.maNguyenLieu !== maNguyenLieu));
    };

    // LƯU THÔNG TIN SẢN PHẨM
    const handleLuuThongTin = async () => {
        if(!formData.maSanPham || !formData.tenSanPham) return alert("Vui lòng nhập Mã và Tên sản phẩm!");

        const payload = {
            maSanPham: formData.maSanPham,
            tenSanPham: formData.tenSanPham,
            donGia: formData.donGia,
            trangThai: formData.trangThai,
            duongDanHinh: formData.duongDanHinh, 
            loaiSanPham: { maLoaiSanPham: formData.maLoaiSanPham },
            danhSachCongThuc: congThuc.map(ct => ({
                id: { maSanPham: formData.maSanPham, maNguyenLieu: ct.maNguyenLieu },
                soLuong: Number(ct.soLuong) 
            }))
        };
        console.log("Payload gửi lên API:", payload);
        try {
            await productApi.create(payload);
            alert("Lưu dữ liệu thành công!");
            onRefresh(); // Load lại dữ liệu ở component cha
            onClose();   // Tắt form
        } catch (error) {
            console.error(error);
            alert("Có lỗi khi lưu sản phẩm!");
        }
    };


return (
    <div className="container san-pham-form-container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0">{isEditing ? `Sửa Sản Phẩm: ${formData.tenSanPham}` : 'Thêm Sản Phẩm Mới'}</h2>
            <button className="btn btn-outline-secondary rounded-pill" onClick={onClose}>
                ← Quay lại danh sách
            </button>
        </div>

        <div className="row g-4">
            {/* BÊN TRÁI: THÔNG TIN CƠ BẢN */}
            <div className="col-md-5">
                <div className="card-lado shadow-sm">
                    <div className="card-header">Thông tin & Hình ảnh</div>
                    <div className="card-body">
                        <div className="image-upload-wrapper mb-4">
                            <label className="form-label-lado">Ảnh Sản Phẩm</label>
                            <input type="file" className="form-control mb-2" accept="image/*" onChange={handleImageUpload} />
                            <div className="image-preview-zone">
                                {formData.duongDanHinh ? (
                                    <img src={formData.duongDanHinh} alt="Preview" />
                                ) : (
                                    <span className="text-muted small">Chưa chọn ảnh</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label-lado">Mã Sản Phẩm</label>
                            <input type="text" className="form-control-lado w-100 bg-light" disabled value={formData.maSanPham} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label-lado">Tên Sản Phẩm</label>
                            <input type="text" className="form-control-lado w-100" value={formData.tenSanPham} onChange={e => setFormData({...formData, tenSanPham: e.target.value})} />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label-lado">Đơn giá (VND)</label>
                                <input type="number" className="form-control-lado w-100" value={formData.donGia} onChange={e => setFormData({...formData, donGia: e.target.value})} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label-lado">Loại sản phẩm</label>
                                <select className="form-control-lado w-100" value={formData.maLoaiSanPham} onChange={e => setFormData({...formData, maLoaiSanPham: e.target.value})}>
                                    {loaiSanPhams.map(loai => (
                                        <option key={loai.maLoaiSanPham} value={loai.maLoaiSanPham}>{loai.tenLoaiSanPham}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label-lado">Trạng thái kinh doanh</label>
                            <select className="form-control-lado w-100" value={formData.trangThai} onChange={e => setFormData({...formData, trangThai: e.target.value})}>
                                <option value="Đang bán">Đang bán</option>
                                <option value="Ngừng bán">Ngừng bán</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* BÊN PHẢI: XÂY DỰNG CÔNG THỨC */}
            <div className="col-md-7">
                <div className="card-lado recipe-card shadow-sm">
                    <div className="card-header">Xây dựng Công Thức (Từ Kho)</div>
                    <div className="card-body">
                        <div className="recipe-builder-row d-flex gap-2 align-items-end">
                            <div className="flex-grow-1">
                                <label className="form-label-lado">Chọn Nguyên Liệu</label>
                                <select className="form-control-lado w-100" value={nlTempt.maNguyenLieu} onChange={e => setNlTempt({...nlTempt, maNguyenLieu: e.target.value})}>
                                    {khoNguyenLieu.map(nl => (
                                        <option key={nl.maNguyenLieu} value={nl.maNguyenLieu}>{nl.tenNguyenLieu} ({nl.donViTinh})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ width: '100px' }}>
                                <label className="form-label-lado">Lượng</label>
                                <input type="number" className="form-control-lado w-100" step="0.1" value={nlTempt.soLuong} onChange={e => setNlTempt({...nlTempt, soLuong: e.target.value})} />
                            </div>
                            <button className="btn btn-warning fw-bold px-4 rounded-pill" onClick={themNguyenLieuVaoCongThuc}>
                                + THÊM
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-recipe">
                                <thead>
                                    <tr>
                                        <th>Mã NL</th>
                                        <th className="text-start">Tên Nguyên Liệu</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-center">Đơn vị</th>
                                        <th className="text-center">Bỏ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {congThuc.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có thành phần công thức</td></tr>
                                    ) : (
                                        congThuc.map(ct => (
                                            <tr key={ct.maNguyenLieu}>
                                                <td className="text-muted small">{ct.maNguyenLieu}</td>
                                                <td className="text-start fw-bold">{ct.tenNguyenLieu}</td>
                                                <td className="text-center qty-highlight">{ct.soLuong}</td>
                                                <td className="text-center">{ct.donViTinh}</td>
                                                <td className="text-center">
                                                    <button className="btn-remove-item mx-auto" onClick={() => xoaNguyenLieuKhoiCongThuc(ct.maNguyenLieu)}>×</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer bg-white border-top-0 text-end p-4">
                        <button className="btn-lado-save" onClick={handleLuuThongTin}>
                            💾 LƯU SẢN PHẨM VÀO HỆ THỐNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default SanPhamForm;