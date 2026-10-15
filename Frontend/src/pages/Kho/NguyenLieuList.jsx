import React, { useState, useEffect } from 'react';
import { khoApi } from '../../api/APIGateway';
import NguyenLieuForm from '../../components/Kho/NguyenLieuForm';
import BaoKhoForm from '../../components/Kho/BaoKhoForm';
import './nguyenLieuList.css';
const NguyenLieuList = () => {
    const [nguyenLieus, setNguyenLieus] = useState([]);
    
    // Quản lý việc đang xem màn hình nào: 'LIST', 'FORM', 'BAO_KHO'
    const [currentView, setCurrentView] = useState('LIST'); 
    
    // Lưu tạm data khi muốn sửa
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await khoApi.getAll();
            setNguyenLieus(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu Kho:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa nguyên liệu này khỏi kho?")) {
            try {
                await khoApi.delete(id);
                loadData();
            } catch (error) {
                alert("Lỗi khi xóa!");
            }
        }
    };

    const getSortedData = () => {
        return [...nguyenLieus].sort((a, b) => {
            const aLow = a.soLuong <= (a.nguongCanhBao ?? 10);
            const bLow = b.soLuong <= (b.nguongCanhBao ?? 10);
            if (aLow && !bLow) return -1;
            if (!aLow && bLow) return 1;
            return 0;
        });
    };

    // Điều hướng form
    if (currentView === 'BAO_KHO') {
        return <BaoKhoForm nguyenLieus={nguyenLieus} onClose={() => setCurrentView('LIST')} />;
    }

    if (currentView === 'FORM') {
        return <NguyenLieuForm 
            isEditing={!!editData} 
            initialData={editData} 
            onRefresh={loadData} 
            onClose={() => setCurrentView('LIST')} 
        />;
    }

    // Mặc định là hiển thị Bảng (LIST)
    return (
    <div className="inventory-container">
        <div className="inventory-header">
            <h2 className="inventory-title">📦 Quản Lý Kho Nguyên Liệu</h2>
            <div className="action-buttons">
                <button className="btn-lado btn-report" onClick={() => setCurrentView('BAO_KHO')}>
                    🔔 Báo Cáo
                </button>
                <button className="btn-lado btn-import" onClick={() => { setEditData(null); setCurrentView('FORM'); }}>
                    + Nhập Kho
                </button>
            </div>
        </div>
        
        <div className="inventory-card">
            <table className="inventory-table">
                <thead>
                    <tr>

                        <th style={{ width: '35%', textAlign: 'left' }}>Tên Nguyên Liệu</th>
                        <th style={{ width: '15%' }}>Tồn Kho</th>
                        <th style={{ width: '10%' }}>Đơn Vị</th>
                        <th style={{ width: '10%' }}>Ngưỡng</th>
                        <th style={{ width: '15%' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedData().map((nl) => {
                        const isLow = nl.soLuong <= (nl.nguongCanhBao ?? 10);
                        return (
                            <tr key={nl.maNguyenLieu} className={isLow ? "row-danger" : ""}>
                                <td className="ten-nl">
                                    {nl.tenNguyenLieu} 
                                    {isLow && <span className="badge-lado bg-danger text-white ms-2">Sắp hết!</span>}
                                </td>
                                <td className={`so-luong ${isLow ? 'text-danger' : 'text-primary'}`}>
                                    {nl.soLuong}
                                </td>
                                <td className="don-vi">{nl.donViTinh}</td>
                                <td className="don-vi" style={{ opacity: 0.6 }}>{nl.nguongCanhBao ?? 10}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className="btn-table btn-edit" onClick={() => { setEditData(nl); setCurrentView('FORM'); }}>Sửa</button>
                                    <button className="btn-table btn-delete" onClick={() => handleDelete(nl.maNguyenLieu)}>Xóa</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default NguyenLieuList;