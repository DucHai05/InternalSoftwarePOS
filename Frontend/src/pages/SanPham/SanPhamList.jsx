import React, { useState, useEffect } from 'react';
import { productApi, khoApi } from '../../api/APIGateway';
import SanPhamForm from '../../components/SanPham/SanPhamForm';
import './sanPhamcss.css';

const SanPhamList = () => {
    // 1. STATE QUẢN LÝ DỮ LIỆU
    const [sanPhams, setSanPhams] = useState([]);
    const [khoNguyenLieu, setKhoNguyenLieu] = useState([]);
    const [loaiSanPhams, setLoaiSanPhams] = useState([]);
    
    // STATE TÌM KIẾM & BỘ LỌC
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    
    // STATE ĐIỀU HƯỚNG GIAO DIỆN
    const [currentView, setCurrentView] = useState('LIST'); // 'LIST' hoặc 'FORM'
    const [editData, setEditData] = useState(null);
    const [editCongThuc, setEditCongThuc] = useState([]);

    // ==========================================
    // HOOK: CHẠY KHI MỞ TRANG
    // ==========================================
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [spRes, nlRes, lspRes] = await Promise.all([
                productApi.getProducts(),
                khoApi.getAll(),
                productApi.getLoaiSP() 
            ]);
            setSanPhams(spRes.data);
            setKhoNguyenLieu(nlRes.data);
            setLoaiSanPhams(lspRes.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    // ==========================================
    // CÁC HÀM XỬ LÝ SỰ KIỆN
    // ==========================================
    const handleDelete = async (maSanPham) => {
        if (window.confirm("Xóa sản phẩm này sẽ xóa luôn công thức của nó. Tiếp tục?")) {
            await productApi.delete(maSanPham);
            loadData();
        }
    };

    const handleEdit = (sp) => {
        const formData = {
            maSanPham: sp.maSanPham,
            tenSanPham: sp.tenSanPham,
            donGia: sp.donGia,
            maLoaiSanPham: sp.maLoaiSanPham || 'LSP01',
            trangThai: sp.trangThai,
            duongDanHinh: sp.duongDanHinh || '' 
        };
        
        let mappedCT = [];
        if (sp.danhSachCongThuc && sp.danhSachCongThuc.length > 0) {
            mappedCT = sp.danhSachCongThuc.map(ct => {
                const nlInfo = khoNguyenLieu.find(nl => nl.maNguyenLieu === ct.id.maNguyenLieu);
                return {
                    maNguyenLieu: ct.id.maNguyenLieu,
                    tenNguyenLieu: nlInfo ? nlInfo.tenNguyenLieu : (ct.nguyenLieu?.tenNguyenLieu || 'N/A'),
                    soLuong: ct.soLuong,
                    donViTinh: nlInfo ? nlInfo.donViTinh : (ct.nguyenLieu?.donViTinh || '')
                };
            });
        }
        
        setEditData(formData);
        setEditCongThuc(mappedCT);
        setCurrentView('FORM');
    };

    // Chuẩn bị danh mục duy nhất cho bộ lọc
    const uniqueCategories = [...new Set(sanPhams.map(sp => sp.tenLoaiSanPham || sp.maLoaiSanPham || 'Chưa phân loại'))];

    const filteredSanPhams = sanPhams.filter(sp => {
        const matchSearch = sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sp.maSanPham.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = sp.tenLoaiSanPham || sp.maLoaiSanPham || 'Chưa phân loại';
        const matchCategory = filterCategory === '' || categoryName === filterCategory;

        return matchSearch && matchCategory;
    });

    // ==========================================
    // ĐIỀU HƯỚNG HIỂN THỊ
    // ==========================================
    if (currentView === 'FORM') {
        return <SanPhamForm 
            isEditing={!!editData} 
            initialData={editData} 
            initialCongThuc={editCongThuc}
            khoNguyenLieu={khoNguyenLieu}
            loaiSanPhams={loaiSanPhams}
            onRefresh={loadData}
            onClose={() => setCurrentView('LIST')}
        />;
    }

return (
    <div className="sanpham-container">
        <div className="sanpham-header">
            <h2 className="sanpham-title">Danh mục Sản phẩm</h2>
            
            <div className="action-bar">
                <select 
                    className="sanpham-select" 
                    value={filterCategory} 
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value="">-- Tất cả loại --</option>
                    {uniqueCategories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className="search-wrapper">
                    <input 
                        type="text" 
                        className="sanpham-input" 
                        placeholder="🔍 Tìm kiếm sản phẩm..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>

                <button className="btn-lado btn-lado-success" onClick={() => { setEditData(null); setEditCongThuc([]); setCurrentView('FORM'); }}>
                    + Thêm Sản Phẩm
                </button>
            </div>
        </div>
        
        <div className="sanpham-card">
            <table className="sanpham-table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        {/* <th>Mã SP</th> */}
                        <th>Tên Sản Phẩm</th>
                        <th>Loại</th>
                        <th>Đơn giá</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSanPhams.length === 0 ? (
                        <tr><td colSpan="7" style={{padding: '40px', color: '#94a3b8'}}>Không tìm thấy sản phẩm nào!</td></tr>
                    ) : (
                        filteredSanPhams.map((sp) => (
                            <tr key={sp.maSanPham}>
                                <td>
                                    <div className="sp-img-container">
                                        {sp.duongDanHinh ? (
                                            <img src={sp.duongDanHinh} alt="sp" />
                                        ) : (
                                            <span style={{fontSize: '10px', color: '#94a3b8'}}>NO IMG</span>
                                        )}
                                    </div>
                                </td>
                                {/* <td style={{fontWeight: '700'}}>{sp.maSanPham}</td> */}
                                <td style={{textAlign: 'left', fontWeight: '600'}}>{sp.tenSanPham}</td>
                                <td>{sp.tenLoaiSanPham || sp.maLoaiSanPham || 'Chưa phân loại'}</td>
                                <td style={{color: 'var(--danger)', fontWeight: '800'}}>
                                    {sp.donGia?.toLocaleString('vi-VN')} đ
                                </td>
                                <td>
                                    <span className={`badge-lado ${sp.trangThai === 'Đang bán' ? 'bg-dang-ban' : 'bg-tam-ngung'}`}>
                                        {sp.trangThai}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-icon btn-icon-edit" onClick={() => handleEdit(sp)}>Sửa</button>
                                    <button className="btn-icon btn-icon-delete" onClick={() => handleDelete(sp.maSanPham)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default SanPhamList;