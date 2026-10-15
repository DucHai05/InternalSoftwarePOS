import React from 'react';
import '../CommonCSS/categoryTab.css'; // Đảm bảo đúng folder nhé Hải

const CategoryTab = ({ categories, activeId, onSelect }) => {
    return (
        <nav className="category-scroll">
            {categories.map((cat) => (
                <div 
                    key={cat.id} 
                    className={`category-item ${activeId === cat.id ? 'active' : ''}`} 
                    onClick={() => onSelect(cat.id)}
                >
                    <span className="cat-name">{cat.name}</span>
                </div>
            ))}
        </nav>
    );
};

export default CategoryTab;