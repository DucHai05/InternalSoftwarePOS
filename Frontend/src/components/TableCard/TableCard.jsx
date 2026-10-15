import React from 'react';
import styles from './TablePage.module.css';

const TableCard = ({ table, onClick }) => {
    // Ép kiểu và làm sạch dữ liệu từ Backend
    const status = String(table.trangThaiThanhToan || "").trim().toUpperCase();
    const isOccupied = status === 'PENDING';

    return (
        <div 
            // SỬA TẠI ĐÂY: Sử dụng biến styles để gọi class
            className={`${styles.tableCard} ${isOccupied ? styles.occupied : styles.empty}`} 
            onClick={() => onClick(table)}
        >
            <div className={styles.tableIcon}>🪑</div>
            <div className={styles.tableNumber}>{table.tenBan}</div>
            <div className={styles.tableStatus}>
                {isOccupied ? 'Có khách' : 'Bàn trống'}
            </div>
            
            {/* Hiệu ứng nhịp thở cho bàn có khách */}
            {isOccupied && <div className={styles.pulseAnimation}></div>}
        </div>
    );
};

export default TableCard;