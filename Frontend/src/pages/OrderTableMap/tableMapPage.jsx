import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'lucide-react';
import { tableApi } from '../../api/APIGateway';
import CategoryTab from '../../components/Common/CategoryTab';
import TableCard from '../../components/TableCard/TableCard';
import './tableMapPage.css';

const TableMapPage = () => {
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([{ id: 'ALL', name: 'Tất cả' }]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    tableApi
      .getTables()
      .then((res) => setTables(res.data))
      .catch((err) => console.error(err));

    tableApi
      .getKhuVuc()
      .then((res) => {
        const apiCategories = res.data.map((kv) => ({
          id: kv.maKhuVuc,
          name: kv.tenKhuVuc
        }));

        setCategories([{ id: 'ALL', name: 'Tất cả' }, ...apiCategories]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTableClick = (table) => navigate(`/staff/order/${table.maBan}`, {
    state: { tableName: table.tenBan },
  });

  const filteredTables = tables.filter((table) => {
    if (activeCategory === 'ALL') return true;

    const tableKV = table.maKhuVuc || table.khuVuc?.maKhuVuc || table.makhuvuc;
    return String(tableKV || '').trim() === String(activeCategory || '').trim();
  });

  return (
    <div className="table-map-wrapper">
      <header className="map-header">
        <div className="header-info">
          <h1>Sơ đồ khu vực/ bàn</h1>
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <span className="dot empty"></span> Trong
          </div>
          <div className="legend-item">
            <span className="dot busy"></span> Co khach
          </div>
        </div>
      </header>

      <div className="filter-section">
        <CategoryTab
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <div className="table-grid-modern">
        {filteredTables.length === 0 ? (
          <div className="empty-state-map">
            <Layout size={48} color="#cbd5e1" />
            <p>Khu vuc nay hien chua co ban nao duoc thiet lap.</p>
          </div>
        ) : (
          filteredTables.map((item) => (
            <TableCard key={item.maBan} table={item} onClick={() => handleTableClick(item)} />
          ))
        )}
      </div>
    </div>
  );
};

export default TableMapPage;
