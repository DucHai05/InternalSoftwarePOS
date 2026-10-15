import React, { useState, useEffect } from 'react';
import { loaiSanPhamApi } from '../../api/APIGateway';
import { Plus, Edit3, Trash2, FolderTree, AlertCircle } from 'lucide-react';
import LoaiSanPhamForm from '../../components/LoaiSanPham/LoaiSanPhamForm';
import './loaiSanPham.css';

export default function LoaiSanPhamList() {
    const [danhSachLoai, setDanhSachLoai] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        fetchData(); 
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await loaiSanPhamApi.getAll();
            setDanhSachLoai(res.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (loai = null) => {
        if (loai) {
            setIsEdit(true);
            setEditData(loai);
        } else {
            setIsEdit(false);
            setEditData(null);
        }
        setShowModal(true);
    };

    const handleDelete = async (id, ten) => {
        if (window.confirm(`CẢNH BÁO: Xóa loại "${ten}" sẽ xóa TẤT CẢ sản phẩm thuộc loại này. Bạn có chắc chắn?`)) {
            try {
                await loaiSanPhamApi.delete(id);
                fetchData();
            } catch (error) {
                alert("Không thể xóa! Có thể loại này đang có sản phẩm liên kết.");
            }
        }
    };

    return (
        <div className="loaisp-container">
            <header className="loaisp-header">
                <div className="header-left">
                    <div className="icon-title bg-indigo">
                        <FolderTree size={24} color="white" />
                    </div>
                    <div>
                        <h2 className="loaisp-title">Phân loại sản phẩm</h2>
                        <p className="loaisp-subtitle">Quản lý các nhóm đồ uống và món ăn của Lado</p>
                    </div>
                </div>
                <button className="btn-add-new" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Thêm Loại Mới
                </button>
            </header>

            <div className="loaisp-card shadow-sm">
                <table className="loaisp-table">
                    <thead>
                        <tr>
                            {/* <th style={{ width: '20%' }}>Mã Loại</th> */}
                            <th style={{ width: '55%', textAlign: 'left' }}>Tên Loại Sản Phẩm</th>
                            <th style={{ width: '25%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="loading-text">Đang tải dữ liệu...</td></tr>
                        ) : danhSachLoai.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="empty-state">
                                    <AlertCircle size={40} />
                                    <p>Chưa có loại sản phẩm nào.</p>
                                </td>
                            </tr>
                        ) : (
                            danhSachLoai.map((loai) => (
                                <tr key={loai.maLoaiSanPham}>
                                    {/* <td className="ma-loai">{loai.maLoaiSanPham}</td> */}
                                    <td className="ten-loai text-left">
                                        <span className="bullet-point"></span>
                                        {loai.tenLoaiSanPham}
                                    </td>
                                    <td>
                                        <div className="action-group">
                                            <button className="btn-action edit" onClick={() => handleOpenModal(loai)} title="Chỉnh sửa">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="btn-action delete" onClick={() => handleDelete(loai.maLoaiSanPham, loai.tenLoaiSanPham)} title="Xóa">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <LoaiSanPhamForm 
                    isEdit={isEdit}
                    initialData={editData}
                    onClose={() => setShowModal(false)}
                    onRefresh={fetchData}
                />
            )}
        </div>
    );
}