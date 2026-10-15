import React from 'react';
import '../Promotion/eventPromoGrid.css';
const EventPromoGrid = ({ data, onEdit, onDelete, onToggle }) => {
  return (
    <div className="event-grid">
      {data.map((ev) => (
        <div key={ev.maKhuyenMai} className={`event-card ${ev.trangThai ? 'active' : ''}`}>
          <div className="event-icon" style={{ backgroundColor: ev.mauSac || '#0ea5e9' }}>🎁</div>
          
          <div className="event-info">
            <h3>{ev.tenKhuyenMai}</h3>
            <p>{ev.moTa}</p>
            <p>Giảm: <strong>{ev.giaTri.toLocaleString()}{ev.loaiKhuyenMai === 'PERCENT' ? '%' : 'đ'}</strong></p>
            
            {/* Bộ nút Sửa/Xóa mới (Modern Style) */}
            <div className="card-actions">
              <button className="text-btn edit" onClick={() => onEdit(ev)}>Sửa</button>
              <button className="text-btn delete" onClick={() => onDelete(ev.maKhuyenMai)}>Xóa</button>
            </div>
          </div>

          <div className="event-action">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={ev.trangThai} 
                onChange={() => onToggle(ev.maKhuyenMai)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventPromoGrid;