import React, { useEffect, useRef } from 'react';
import { Tag, Layers, ArrowLeftRight } from 'lucide-react'; // Sử dụng Lucide icon cho Pro
import '../CommonCSS/orderDropdown.css';

const OrderDropdown = ({ 
    show, 
    onClose, 
    onOpenPromo, 
    onPrintKitchen, 
    onOpenOrderNote 
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="dropdown-menu" ref={dropdownRef}>
            <button onClick={() => { onOpenPromo(); onClose(); }}>
                <Tag size={16} /> <span>Khuyến mãi</span>
            </button>
            <button onClick={() => { onPrintKitchen(); onClose(); }}>
                <Layers size={16} /> <span>Gộp bàn</span>
            </button>
            <button onClick={() => { onOpenOrderNote(); onClose(); }}>
                <ArrowLeftRight size={16} /> <span>Chuyển bàn</span>
            </button>
        </div>
    );
};

export default OrderDropdown;