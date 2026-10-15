import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Info, MoreVertical, X } from 'lucide-react';
import { orderApi, promoApi, tableApi, doanhthuApi, productApi } from '../../api/APIGateway'; 
import PhanLoaiCard from '../../components/Common/PhanLoaiCard'; 
import CategoryTab from '../../components/Common/CategoryTab';
import KitchenSlipModal from '../../components/Common/KitchenSlipModal';
import CartFooter from '../../components/Common/CartFooter';
import PromotionModal from '../../components/Common/PromotionModal';
import NoteModal from '../../components/Common/NoteModal';
import CartList from '../../components/Common/CartList';
import OrderDropdown from '../../components/Common/OrderDropdown';
import ConfirmDeleteModal from '../../components/Common/ConfirmDeleteModal';
import * as CartHelpers from '../../utils/cartHelpers';
import './orderPage.css';
const OrderPage = () => {
    const { maBan } = useParams();
    const navigate = useNavigate();
    const tableName = useLocation().state?.tableName;
    const menuRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [allPromos, setAllPromos] = useState([]);
    const [maHoaDon, setMaHoaDon] = useState(null);
    const [maCaOpen, setMaCaOpen] = useState('');
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(true);
    const [menuError, setMenuError] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
    const [retryKey, setRetryKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isKitchenSlipOpen, setIsKitchenSlipOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, index: null, item: null });
    const [itemsToPrint, setItemsToPrint] = useState([]);
    const [nameTable, setNameTable] = useState('');

    const [autoDiscount, setAutoDiscount] = useState(null);
    const [manualDiscount, setManualDiscount] = useState(null);
    const [originalCart, setOriginalCart] = useState([]);
    const [categories, setCategories] = useState([{ id: 'ALL', name: 'Tất cả' }]);
    const validatePromoValid = (promo, currentSubTotal, currentCart) => {
    if (!promo || !promo.configs || promo.configs.length === 0) return false;
    
    const config = promo.configs[0];

    // 1. Check số tiền tối thiểu
    if (currentSubTotal < config.giaTriDonToiThieu) return false;

    // 2. Check loại món (nếu có yêu cầu cụ thể)
    if (config.apDungChoMon !== 'ALL') {
        const hasCategory = currentCart.some(item => item.loai === config.apDungChoMon);
        if (!hasCategory) return false;
    }

    return true;
};
    // Khuyen mai
    const subTotal = React.useMemo(() => 
        CartHelpers.calculateSubTotal(cart), [cart]);

    // 1. Tính giảm giá tự động (Hệ thống)
    const autoDiscountVal = React.useMemo(() => {
        // Nếu không thỏa mãn điều kiện (ví dụ chưa đủ 150k) -> Trả về 0đ giảm giá
        if (!validatePromoValid(autoDiscount, subTotal, cart)) return 0;
        
        return CartHelpers.calculateDiscountValue(autoDiscount, subTotal);
    }, [autoDiscount, subTotal, cart]); // Thêm cart vào đây

    // 2. Tính giảm giá chọn tay (Nhân viên chọn)
    const manualDiscountVal = React.useMemo(() => {
        // Tương tự, nếu nhân viên chọn mã mà đơn chưa đủ tiền -> Cũng trả về 0đ
        if (!validatePromoValid(manualDiscount, subTotal, cart)) return 0;

        return CartHelpers.calculateDiscountValue(manualDiscount, subTotal);
    }, [manualDiscount, subTotal, cart]);

    const totalAmount = React.useMemo(() => 
        CartHelpers.calculateFinalTotal(subTotal, autoDiscountVal, manualDiscountVal), 
        [subTotal, autoDiscountVal, manualDiscountVal]);

   useEffect(() => {
        if (!maBan) return;
        const controller = new AbortController();
        const config = { signal: controller.signal, timeout: 5000 };
        const isActive = () => !controller.signal.aborted;
        const errorText = (error, fallback) => error.code === 'ECONNABORTED'
            ? 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.'
            : error.response?.data?.message || error.response?.data?.error || fallback;

        setLoading(true);
        setCheckoutLoading(true);
        setMenuError('');
        setCheckoutError('');
        setProducts([]);
        setCart([]);
        setOriginalCart([]);
        setMaHoaDon(null);
        setMaCaOpen('');
        setAllPromos([]);
        setAutoDiscount(null);
        setManualDiscount(null);
        setActiveCategory('ALL');
        setCategories([{ id: 'ALL', name: 'Tất cả' }]);
        setNameTable(tableName || `Bàn ${maBan}`);

        // Start the bill request immediately; optional metadata does not block the menu.
        const productsRequest = productApi.getProducts(config);
        const billRequest = orderApi.loadBan(maBan, config);
        const shiftRequest = doanhthuApi.getMaCaDangMo(config);
        const promosRequest = promoApi.getActivePromos(config);

        productsRequest.then(({ data }) => {
            if (isActive()) setProducts(data);
        }).catch(error => {
            if (isActive()) setMenuError(errorText(error, 'Không thể tải thực đơn.'));
        }).finally(() => {
            if (isActive()) setLoading(false);
        });

        productApi.getLoaiSP(config).then(({ data }) => {
            if (isActive()) setCategories([{ id: 'ALL', name: 'Tất cả' }, ...data.map(c => ({
                id: c.maLoaiSanPham, name: c.tenLoaiSanPham,
            }))]);
        }).catch(error => {
            if (isActive()) console.error('Không tải được nhóm món:', error);
        });

        if (!tableName) tableApi.getTableName(maBan, config).then(({ data }) => {
            if (isActive()) setNameTable(data.tenBan || `Bàn ${maBan}`);
        }).catch(error => {
            if (isActive()) console.error('Không tải được tên bàn:', error);
        });

        Promise.all([productsRequest, billRequest, shiftRequest, promosRequest])
            .then(([prodRes, orderRes, caRes, promoRes]) => {
                if (!isActive()) return;
                const shiftId = typeof caRes.data === 'string' ? caRes.data.trim() : caRes.data?.maCa;
                if (!shiftId) throw new Error('Chưa có ca làm việc đang mở.');
                setMaCaOpen(shiftId);
                setAllPromos(promoRes.data);
                setAutoDiscount(promoRes.data.find(p => p.configs?.some(c => c.loaiDoiTuong === 'ALL')) || null);
                const productNames = new Map(prodRes.data.map(p => [p.maSanPham, p.tenSanPham]));
                const items = (orderRes.data?.items || []).map(item => ({
                    ...item,
                    tenSanPham: productNames.get(item.maSanPham) || item.tenSanPham || item.maSanPham,
                }));
                setCart(items);
                setOriginalCart(items.map(item => ({ ...item })));
                setMaHoaDon(orderRes.data?.maHoaDon || null);
            }).catch(error => {
                if (isActive()) setCheckoutError(errorText(error,
                    error.message === 'Chưa có ca làm việc đang mở.' ? error.message : 'Không thể tải dữ liệu hóa đơn, ca hoặc khuyến mãi.'));
            }).finally(() => {
                if (isActive()) setCheckoutLoading(false);
            });

        return () => controller.abort();
    }, [maBan, tableName, retryKey]);

    const checkoutDisabled = checkoutLoading || Boolean(checkoutError);

    
   const filteredProducts = React.useMemo(() => {
        return products
            .filter(p => {
                if (activeCategory === 'ALL') return true;

                return (p.maLoaiSanPham === activeCategory) || (p.loaiSanPham?.maLoaiSanPham === activeCategory);
            })
            .filter(p => 
                p.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.maSanPham.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [products, activeCategory, searchTerm]);


    const handleConfirmOrder = async (isGoingToPayment = false) => {
            if (checkoutDisabled) return null;
            if (cart.length === 0) return null;
            try {
                const orderData = { 
                    maHoaDon, maBan, maCa: maCaOpen,
                    items: cart.map(i => ({ 
                        maSanPham: i.maSanPham, 
                        soLuong: i.soLuong, 
                        giaBan: i.giaBan, 
                        ghiChu: i.ghiChu || "" 
                    })),
                    tongTien: totalAmount
                };
                
                const res = await orderApi.staffCreate(orderData);
                const newMaHD = res.data.hoaDon?.maHoaDon || res.data.savedHD?.maHoaDon || res.data.maHoaDon || maHoaDon;
                if (newMaHD) setMaHoaDon(newMaHD);
                
                await tableApi.updateTrangThai(maBan, 'PENDING');
                setOriginalCart(cart.map(item => ({ ...item, slipNote: undefined })));
                
                if (!isGoingToPayment) {
                    navigate('/sell');
                }
                return newMaHD;
            } catch (err) { 
                alert("Lỗi khi lưu đơn hàng!");
                return null; 
            }
    };
    const handlePrepareKitchenSlip = () => {
                if (checkoutDisabled) return;
                if (cart.length === 0) {
                alert("Chưa có món nào được chọn! Vui lòng chọn món trước khi báo bếp.");
                return;
            }

                const printItems = [];
                const buildSlipNote = (item, action) => {
                    if (item?.ghiChu) {
                        return `${action} - ${item.ghiChu}`;
                    }
                    return action;
                };

                // 1. Tìm món mới hoặc món tăng số lượng
                cart.forEach(item => {
                    const oldItem = originalCart.find(o => o.maSanPham === item.maSanPham);
                    if (!oldItem) {
                        // Món mới hoàn toàn
                        printItems.push({ ...item, slipNote: buildSlipNote(item, "MỚI") });
                    } else if (item.soLuong > oldItem.soLuong) {
                        // Tăng số lượng
                        printItems.push({
                            ...item,
                            soLuong: item.soLuong - oldItem.soLuong,
                            slipNote: buildSlipNote(item, "THÊM")
                        });
                    } else if (item.soLuong < oldItem.soLuong) {
                        // Giảm số lượng
                        printItems.push({
                            ...item,
                            soLuong: oldItem.soLuong - item.soLuong,
                            slipNote: buildSlipNote(item, "GIẢM/HỦY")
                        });
                    } else if (item.ghiChu !== oldItem.ghiChu) {
                        // Ghi chú thay đổi mà số lượng không đổi
                        printItems.push({
                            ...item,
                            slipNote: item.ghiChu || "CẬP NHẬT"
                        });
                    }
                });

                // 2. Tìm món bị xóa sạch khỏi giỏ hàng
                originalCart.forEach(oldItem => {
                    const stillInCart = cart.find(c => c.maSanPham === oldItem.maSanPham);
                    if (!stillInCart) {
                        printItems.push({ ...oldItem, slipNote: buildSlipNote(oldItem, "HỦY MÓN") });
                    }
                });

                if (printItems.length > 0) {
                    setItemsToPrint(printItems);
                    setIsKitchenSlipOpen(true);
                } else {
                    // Nếu không có gì thay đổi so với DB, chỉ cần lưu hoặc báo thành công
                    handleConfirmOrder(false);
                }
        };
    const handleGoToPayment = async () => {
            const finalMaHoaDon = await handleConfirmOrder(true);
            if (!finalMaHoaDon) return;
            
            navigate(`/payment/${maBan}`, {
                state: { 
                    maHoaDon: finalMaHoaDon, 
                    cart, 
                    maCa: maCaOpen, 
                    totalAmount, 
                    subTotal, 
                    manualDiscount, 
                    autoDiscount,
                    nameTable 
                }
            });
        };
    const addToCart = (p) => {
        if (checkoutDisabled) return;
        const existing = cart.find(i => i.maSanPham === p.maSanPham);
        if (existing) setCart(cart.map(i => i.maSanPham === p.maSanPham ? { ...i, soLuong: i.soLuong + 1 } : i));
        else setCart([...cart, { ...p, giaBan: p.giaBan || p.donGia, soLuong: 1 }]);
    };


    if (loading) return <div className="order-loading">Đang chuẩn bị thực đơn...</div>;
    if (menuError) return <div className="order-load-error" role="alert">
        <p>{menuError}</p>
        <button onClick={() => setRetryKey(key => key + 1)}>Thử lại</button>
    </div>;
    
    return (
        <div className="order-page-wrapper">
            {/* THỰC ĐƠN BÊN TRÁI */}
            <main className="menu-container">
                <header className="menu-header">
                    <div className="header-title">
                        <h2>Thực đơn gọi món</h2>
                    </div>
                    <div className="menu-search">
                        <Search size={18} />
                        <input 
                            type="text" placeholder="Tìm tên món, mã sản phẩm..." 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && <X size={16} className="clear-search" onClick={() => setSearchTerm('')} />}
                    </div>
                </header>

                <CategoryTab 
                    categories={categories} 
                    activeId={activeCategory} 
                    onSelect={setActiveCategory} 
                />

                <div className="product-scroll-area">
                    <div className="product-grid-modern">
                            {filteredProducts.map(p => (
                                <PhanLoaiCard 
                                    key={p.maSanPham}
                                    title={p.tenSanPham}
                                    subtitle={p.giaBan?.toLocaleString('vi-VN') || p.donGia?.toLocaleString('vi-VN')} đ
                                    image={p.duongDanHinh}
                                    onClick={() => addToCart(p)}
                                    type="product"
                                    disabled={checkoutDisabled}
                                />
                            ))
                        }
                    </div>
                </div>
            </main>

            {/* GIỎ HÀNG BÊN PHẢI */}
            <aside className="cart-container">
                <header className="cart-header-modern">
                    <div className="cart-info">
                        <ShoppingCart size={20} />
                        <h3>Chi tiết hóa đơn</h3>
                    </div>
                    <div className="cart-actions-top" ref={menuRef}>
                        <span className="table-label">{nameTable}</span>
                        <button className="btn-more" onClick={() => setShowMenu(!showMenu)}><MoreVertical size={20}/></button>
                            <OrderDropdown 
                            show={showMenu} onClose={() => setShowMenu(false)}
                            onOpenPromo={() => { setIsPromoModalOpen(true); setShowMenu(false); }}
                            onPrintKitchen={handlePrepareKitchenSlip}
                        />
                    </div>
                </header>

                <div className="cart-items-area">
                    {checkoutLoading && <p className="order-load-status" role="status">Đang tải dữ liệu bàn...</p>}
                    {checkoutError && <div className="order-load-error" role="alert">
                        <p>{checkoutError}</p>
                        <button onClick={() => setRetryKey(key => key + 1)}>Thử lại</button>
                    </div>}
                    <CartList 
                        cart={cart} 
                        onRemoveItem={(idx) => {
                            const item = cart[idx];
                            if (!item.maChiTietHD) setCart(prev => prev.filter((_, i) => i !== idx));
                            else setDeleteConfirm({ open: true, index: idx, item });
                        }}
                        onUpdateQty={(idx, qty) => {
                            const newCart = [...cart];
                            newCart[idx] = { ...newCart[idx], soLuong: qty };
                            setCart(newCart);
                        }}
                        onItemClick={(idx) => { setEditingIdx(idx); setIsNoteModalOpen(true); }}
                    />
                </div>

                <CartFooter 
                    disabled={checkoutDisabled}
                    autoDiscount={autoDiscount} autoDiscountVal={autoDiscountVal}
                    manualDiscount={manualDiscount} manualDiscountVal={manualDiscountVal}
                    totalAmount={totalAmount}
                    onConfirm={handlePrepareKitchenSlip}
                    onPayment={handleGoToPayment}
                    onDelete={async () => {
                        const res = await tableApi.getBanTrong(maBan);
                        const status = res.data?.trangThaiThanhToan || res.data?.trangThai;
                        if (status === 'PAID') {
                            setCart([]); setMaHoaDon(null); navigate('/sell');
                        } else alert("Bàn chưa thanh toán!");
                    }}
                />
            </aside>

            {/* CÁC MODAL PHỤ TRỢ (Giữ nguyên component) */}
            <NoteModal isOpen={isNoteModalOpen} item={cart[editingIdx]} onSave={(note) => {
                const newCart = [...cart];
                newCart[editingIdx] = { ...newCart[editingIdx], ghiChu: note };
                setCart(newCart);
                setIsNoteModalOpen(false);
            }} onClose={() => setIsNoteModalOpen(false)} />
            
            <ConfirmDeleteModal isOpen={deleteConfirm.open} itemName={deleteConfirm.item?.tenSanPham} 
                onCancel={() => setDeleteConfirm({ open: false, item: null })}
                onConfirm={async () => {
                    await orderApi.removeOrderItem(deleteConfirm.item.maChiTietHD);
                    setCart(prev => prev.filter((_, i) => i !== deleteConfirm.index));
                    setDeleteConfirm({ open: false, index: null, item: null });
                }} 
            />

            <PromotionModal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} promos={allPromos.filter(p => p.configs?.some(c => c.loaiDoiTuong === 'SELECTIVE'))}
                onSelect={(p) => { setManualDiscount(p); setIsPromoModalOpen(false); }} />

            <KitchenSlipModal 
            isOpen={isKitchenSlipOpen} 
            onClose={() => setIsKitchenSlipOpen(false)} nameTable={nameTable} cart={itemsToPrint}
            onConfirm={async () => { 
                await handleConfirmOrder(false);
                setIsKitchenSlipOpen(false); 
            }} 
            maHoaDon={maHoaDon}
            />
        </div>
    );
};

export default OrderPage;
