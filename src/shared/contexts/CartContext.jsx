import  { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCartApi, 
  addToCartApi, 
  updateCartQuantityApi, 
  removeFromCartApi
} from '@/modules/cart/services/cartApi';
import toast from 'react-hot-toast';
import { useAuth } from '@/shared/contexts/AuthContext';

const CartContext = createContext();

/**
 * 🛒 CartProvider
 * ศูนย์กลางจัดการข้อมูลตะกร้าสินค้าสำหรับทั้งแอปพลิเคชัน
 */
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // 1. ดึงข้อมูลตะกร้าจาก API
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setSummary({ subtotal: 0, total: 0, itemCount: 0, shippingFee: 0 });
      return;
    }
    
    setLoading(true);
    try {
      const response = await getCartApi();

      if (response.success) {
        // แจ้งเตือนถ้ามีการปรับสต็อกอัตโนมัติจากหลังบ้าน
        if (response.isStockAdjusted) {
          toast('สินค้าบางรายการถูกปรับจำนวนเนื่องจากสต็อกไม่พอ', {
            icon: '⚠️',
            duration: 4000,
            style: { borderRadius: '15px', fontWeight: 'bold', background: '#fffbeb', color: '#92400e' }
          });
        }

        const { items: rawItems, subtotal, shippingFee, total } = response.data;
        
        const mappedItems = rawItems.map(item => ({
          id: item.product._id || item.product.id,
          name: item.product.modelName || item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image?.url || item.product.image,
          description: item.product.description
        }));

        setCartItems(mappedItems);
        setSummary({
          subtotal,
          shippingFee,
          total,
          itemCount: mappedItems.reduce((acc, item) => acc + item.quantity, 0)
        });
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. เพิ่มสินค้า
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อใช้งานตะกร้าสินค้า", { id: 'auth-error' });
      return;
    }

    try {
      const res = await addToCartApi(productId, quantity);
      if (res.success) {
        toast.success("เพิ่มสินค้าลงตะกร้าแล้ว", { icon: '🛒' });
        await fetchCart(); // ดึงข้อมูลล่าสุดทันที
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
  };

  // 3. อัปเดตจำนวน
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const res = await updateCartQuantityApi(productId, quantity);
      if (res.success) {
        await fetchCart();
      }
    } catch (error) {
      toast.error("อัปเดตจำนวนไม่สำเร็จ");
    }
  };

  // 4. ลบสินค้า
  const removeItem = async (productId) => {
    try {
      const res = await removeFromCartApi(productId);
      if (res.success) {
        toast.success("ลบสินค้าออกจากตะกร้าแล้ว");
        await fetchCart();
      }
    } catch (error) {
      toast.error("ลบสินค้าไม่สำเร็จ");
    }
  };

  // 🔄 ซิงค์ข้อมูลเมื่อ User ล็อกอิน/ล็อกเอาท์
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value = {
    cartItems,
    summary,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook สำหรับเรียกใช้งานได้ง่ายๆ
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
