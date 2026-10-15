import React, { useState, useEffect } from 'react';
import '../CommonCSS/noteModal.css';
const NoteModal = ({ isOpen, item, onSave, onClose }) => {
    const [tempNote, setTempNote] = useState("");
    const quickNotes = ['Ít đường', 'Ít đá', 'Nhiều tương ớt', 'Mang về'];

    // Đồng bộ ghi chú cũ vào textarea mỗi khi mở modal
    useEffect(() => {
        if (isOpen) setTempNote(item?.ghiChu || "");
    }, [isOpen, item]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="note-modal-content">
                <h3>Ghi chú: {item?.tenSanPham}</h3>
                
                <div className="quick-notes">
                    {quickNotes.map(note => (
                        <button 
                            key={note} 
                            onClick={() => setTempNote(prev => prev ? `${prev}, ${note}` : note)}
                        >
                            + {note}
                        </button>
                    ))}
                </div>

                <textarea 
                    rows="3" 
                    value={tempNote} 
                    onChange={(e) => setTempNote(e.target.value)}
                    placeholder="Nhập yêu cầu khác của khách..."
                />

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button className="btn-confirm" onClick={() => onSave(tempNote)}>
                        Lưu ghi chú
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;