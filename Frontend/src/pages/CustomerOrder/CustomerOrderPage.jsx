import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircleCheckBig, QrCode, Search, ShoppingCart, X } from 'lucide-react';
import { orderApi, promoApi, tableApi, doanhthuApi } from '../../api/APIGateway';
import * as CartHelpers from '../../utils/cartHelpers';
import CategoryTab from '../../components/Common/CategoryTab';
import NoteModal from '../../components/Common/NoteModal';
import PhanLoaiCard from '../../components/Common/PhanLoaiCard';
import CartList from '../../components/Common/CartList';
import '../../pages/OrderPage/orderPage.css';
import './CustomerOrderPage.css';

const categories = [
  { id: 'ALL', name: 'Tat ca' },
  { id: 'CAFE', name: 'Ca phe' },
  { id: 'TEA', name: 'Tra sua' },
  { id: 'FOOD', name: 'Do an' }
];

const CustomerOrderPage = () => {
  const { maBan } = useParams();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [maHoaDon, setMaHoaDon] = useState(null);
  const [maCaOpen, setMaCaOpen] = useState('');
  const [autoDiscount, setAutoDiscount] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [submittedAt, setSubmittedAt] = useState('');

  const subTotal = useMemo(() => CartHelpers.calculateSubTotal(cart), [cart]);
  const autoDiscountVal = useMemo(
    () => CartHelpers.calculateDiscountValue(autoDiscount, subTotal),
    [autoDiscount, subTotal]
  );
  const totalAmount = useMemo(
    () => CartHelpers.calculateFinalTotal(subTotal, autoDiscountVal, 0),
    [subTotal, autoDiscountVal]
  );

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [prodRes, caRes, promoRes, orderRes] = await Promise.all([
          orderApi.getProducts(),
          doanhthuApi.getMaCaDangMo(),
          promoApi.getActivePromos(),
          orderApi.loadBan(maBan)
        ]);

        setProducts(prodRes.data || []);
        setMaCaOpen(caRes.data?.maCa || caRes.data || '');

        const activePromos = promoRes.data || [];
        const autoPromo = activePromos.find((promo) =>
          promo.configs?.some((config) => config.loaiDoiTuong === 'ALL')
        );
        setAutoDiscount(autoPromo || null);

        if (orderRes.data?.items?.length > 0) {
          const data = orderRes.data;
          const orderId = data.maHoaDon || data.items[0]?.maChiTietHD?.split('CTHD')[0] || null;
          setCart(data.items);
          setMaHoaDon(orderId);
        } else {
          setCart([]);
          setMaHoaDon(null);
        }
      } catch (error) {
        console.error('Loi khoi tao trang order khach hang:', error);
      } finally {
        setLoading(false);
      }
    };

    if (maBan) {
      initData();
    }
  }, [maBan]);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return products
      .filter((product) => activeCategory === 'ALL' || product.loai === activeCategory)
      .filter((product) => {
        const name = product.tenSanPham?.toLowerCase?.() || '';
        const code = product.maSanPham?.toLowerCase?.() || '';
        return name.includes(keyword) || code.includes(keyword);
      });
  }, [products, activeCategory, searchTerm]);

  const addToCart = (product) => {
    setSubmittedAt('');

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.maSanPham === product.maSanPham);
      if (existing) {
        return prevCart.map((item) =>
          item.maSanPham === product.maSanPham ? { ...item, soLuong: item.soLuong + 1 } : item
        );
      }

      return [...prevCart, { ...product, soLuong: 1 }];
    });
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('Vui long chon mon truoc khi gui yeu cau.');
      return;
    }

    try {
      const payload = {
        maHoaDon,
        maBan,
        maCa: maCaOpen,
        items: cart.map((item) => ({
          maSanPham: item.maSanPham,
          soLuong: item.soLuong,
          giaBan: item.giaBan,
          ghiChu: item.ghiChu || ''
        })),
        tongTien: totalAmount
      };

      const response = await orderApi.staffCreate(payload);
      const savedOrderId = response.data?.savedHD?.maHoaDon || response.data?.maHoaDon || maHoaDon;

      setMaHoaDon(savedOrderId || null);
      setSubmittedAt(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
      await tableApi.updateTrangThai(maBan, 'PENDING');
    } catch (error) {
      console.error('Loi gui order khach hang:', error);
      alert('Khong the gui yeu cau luc nay. Vui long thu lai.');
    }
  };

  if (loading) {
    return <div className="order-loading">Dang chuan bi thuc don...</div>;
  }

  return (
    <div className="customer-order-shell">
      <div className="order-page-wrapper customer-order-wrapper">
        <main className="menu-container">
          <header className="menu-header">
            

            <div className="header-title">
              <h2>Thuc don goi mon</h2>
              <p>
                Ban dang chon: <span>{maBan}</span>
              </p>
            </div>

            <div className="menu-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tim ten mon, ma san pham..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <X size={16} className="clear-search" onClick={() => setSearchTerm('')} />
              )}
            </div>
          </header>

          <CategoryTab
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />

          <div className="product-scroll-area">
            <div className="product-grid-modern">
              {filteredProducts.map((product) => (
                <PhanLoaiCard
                  key={product.maSanPham}
                  title={product.tenSanPham}
                  subtitle={`${Number(product.giaBan || 0).toLocaleString()}d`}
                  image={product.duongDanHinh}
                  onClick={() => addToCart(product)}
                  type="product"
                />
              ))}
            </div>
          </div>
        </main>

        <aside className="cart-container">
          <header className="cart-header-modern">
            <div className="cart-info">
              <ShoppingCart size={20} />
              <h3>Chi tiet hoa don</h3>
            </div>
            <div className="cart-actions-top">
              <span className="table-label">Ban {maBan}</span>
            </div>
          </header>

          <div className="cart-items-area">
            <CartList
              cart={cart}
              onRemoveItem={(idx) => {
                setSubmittedAt('');
                const item = cart[idx];

                if (item.maChiTietHD) {
                  alert('Mon da gui xuong he thong. Vui long lien he nhan vien neu can dieu chinh.');
                  return;
                }

                setCart((prevCart) => prevCart.filter((_, index) => index !== idx));
              }}
              onUpdateQty={(idx, qty) => {
                setSubmittedAt('');
                setCart((prevCart) =>
                  prevCart.map((item, index) => (index === idx ? { ...item, soLuong: qty } : item))
                );
              }}
              onItemClick={(idx) => {
                setEditingIdx(idx);
                setIsNoteModalOpen(true);
              }}
            />
          </div>

          {submittedAt && (
            <div className="customer-order-success">
              <CircleCheckBig size={18} />
              <div>
                <strong>Da gui yeu cau luc {submittedAt}</strong>
                <p>Ma hoa don: {maHoaDon || 'dang cap nhat'}.</p>
              </div>
            </div>
          )}

          <div className="customer-order-footer">
            {autoDiscountVal > 0 && (
              <div className="discount-summary auto">
                <span>Uu dai ({autoDiscount?.tenKhuyenMai}):</span>
                <span>-{autoDiscountVal.toLocaleString()}d</span>
              </div>
            )}

            <div className="total-row">
              <span>Tong cong:</span>
              <span className="total-price">{totalAmount.toLocaleString()}d</span>
            </div>

            <button className="customer-order-submit" type="button" onClick={handleSubmitOrder}>
              Gui yeu cau order
            </button>
          </div>
        </aside>
      </div>

      <NoteModal
        isOpen={isNoteModalOpen}
        item={cart[editingIdx]}
        onSave={(note) => {
          setSubmittedAt('');
          setCart((prevCart) =>
            prevCart.map((item, index) => (index === editingIdx ? { ...item, ghiChu: note } : item))
          );
          setIsNoteModalOpen(false);
        }}
        onClose={() => setIsNoteModalOpen(false)}
      />
    </div>
  );
};

export default CustomerOrderPage;
