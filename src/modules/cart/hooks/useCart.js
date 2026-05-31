import { useState, useEffect, useCallback } from 'react';
import { 
  getCartApi, 
  addToCartApi, 
  updateCartQuantityApi, 
  removeFromCartApi,
  getCartSummaryApi
} from '../services/cartApi';
import toast from 'react-hot-toast';
import { useAuth } from '@/shared/contexts/AuthContext';

/**
 * 🎣 useCart Hook
 * จัดการ Logic ตะกร้าสินค้าทั้งหมด (Smart Hook)
 * รองรับการซิงค์ข้อมูลกับ Backend API
 */
export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // 1. ดึงข้อมูลตะกร้าจาก API
  const fetchCart = useCallback(async () => {
    if (!user) return; // ถ้าไม่ล็อกอิน ไม่ดึง API
    
    setLoading(true);
    try {
      const [cartRes, summaryRes] = await Promise.all([
        getCartApi(),
        getCartSummaryApi()
      ]);

      if (cartRes.success) {
        // Mapping ข้อมูลจาก Backend ให้เข้ากับ UI
        // Backend มักจะส่ง item.product มาให้
        const items = cartRes.data.map(item => ({
          id: item.product._id || item.product.id,
          name: item.product.modelName || item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image?.url || item.product.image,
          description: item.product.description
        }));
        setCartItems(items);
      }

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
      // ถ้า Error 401 (Unauth) อาจจะหมายถึง Token หมดอายุ
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. เพิ่มสินค้า
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อใช้งานตะกร้าสินค้า");
      return;
    }

    try {
      const res = await addToCartApi(productId, quantity);
      if (res.success) {
        toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
        fetchCart(); // รีเฟรชข้อมูล
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
        fetchCart();
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
        fetchCart();
      }
    } catch (error) {
      toast.error("ลบสินค้าไม่สำเร็จ");
    }
  };

  // 🔄 โหลดข้อมูลอัตโนมัติเมื่อเข้าหน้า หรือ User เปลี่ยน
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    summary,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart
  };
};
