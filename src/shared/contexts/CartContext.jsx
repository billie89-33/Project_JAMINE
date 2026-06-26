import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  getCartApi, 
  addToCartApi, 
  updateCartQuantityApi, 
  removeFromCartApi,
  clearCartApi
} from '@/modules/cart/services/cartApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/contexts/AuthContext';

const CartContext = createContext();

/**
 * 🛒 CartProvider
 * ศูนย์กลางจัดการข้อมูลตะกร้าสินค้าสำหรับทั้งแอปพลิเคชัน (Standard Compliant)
 */
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ 
    subtotal: 0, 
    shipping: 0, 
    discount: 0, 
    total: 0, 
    itemCount: 0 
  });
  const [loading, setLoading] = useState(false);
  const debounceTimers = useRef({});

  const syncCartState = useCallback((response) => {
    if (!response.success) return;

    // ⚠️ Doc 11.3: แจ้งเตือนถ้ามีการปรับสต็อกอัตโนมัติจากหลังบ้าน
    if (response.isStockAdjusted) {
      toast('สินค้าบางรายการถูกปรับจำนวนเนื่องจากสต็อกไม่พอ', {
        icon: '⚠️',
        duration: 5000,
        style: { 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          background: '#FFF4E5', 
          color: '#663C00',
          border: '1px solid #FFB077'
        }
      });
    }

    const { items: rawItems, subtotal, shippingFee, shipping, total, totalAmount } = response.data;
    
    // 🛠️ Fix & Resilience: รองรับทั้ง item.productId และ item.product และดึง ID อย่างปลอดภัย
    const mappedItems = rawItems.map(item => {
      const productObj = item.productId || item.product; // ดึงออบเจกต์สินค้า
      const finalId = productObj?._id || productObj?.id || (typeof productObj === 'string' ? productObj : null);
      
      return {
        id: finalId, // 🔑 คีย์สำคัญสำหรับกด เพิ่ม/ลด/ลบ ต้องห้ามเป็น undefined
        cartItemId: item._id,
        name: productObj?.modelName || productObj?.name || 'Unknown Product',
        brand: productObj?.brand || '',
        price: productObj?.price || 0,
        quantity: item.quantity,
        image: productObj?.image?.url || productObj?.image || 'https://via.placeholder.com/300',
        description: productObj?.description || '',
        stock: productObj?.stock || 0
      };
    });

    setCartItems(mappedItems);
    // ✨ Doc 12.3 & V2 Spec: Trust the Backend Summary (Resilient Aliasing)
    setSummary({
      subtotal: subtotal || 0,
      shipping: shippingFee !== undefined ? shippingFee : (shipping || 0),
      discount: response.data.discount || 0,
      total: total || totalAmount || 0,
      itemCount: mappedItems.reduce((acc, item) => acc + item.quantity, 0)
    });
  }, []);

  // 1. ดึงข้อมูลตะกร้าจาก API
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setSummary({ subtotal: 0, shipping: 0, discount: 0, total: 0, itemCount: 0 });
      return;
    }
    
    setLoading(true);
    try {
      const response = await getCartApi();
      syncCartState(response);
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

    // 🛡️ Doc 11.4: ป้องกัน Race Condition
    if (loading) return;

    setLoading(true);
    try {
      const res = await addToCartApi(productId, quantity);
      if (res.success) {
        toast.success("เพิ่มสินค้าลงตะกร้าแล้ว", { icon: '🛒' });
        syncCartState(res); // 🚀 เร็วขึ้น 2 เท่า: ไม่อัปเดตข้อมูลผ่านการยิง GET ซ้ำ
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 3. อัปเดตจำนวน (⚡ Optimistic UI + Debounced API Sync)
  const updateQuantity = async (productId, quantity) => {
    if (!productId) return; 
    
    // ถ้าจำนวนลดเหลือน้อยกว่า 1 ให้ถือเป็นการลบสินค้าทิ้ง
    if (quantity < 1) {
      return removeItem(productId);
    }

    // ⚡ เทคนิคที่ 1: Optimistic UI Update (อัปเดต State หน้าบ้านทันทีใน 0.01 วินาที)
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });

      // คำนวณสรุปยอดเงินชั่วคราวให้ผู้ใช้เห็นทันที (Optimistic Summary)
      const newSubtotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const newItemCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
      
      setSummary(prevSummary => ({
        ...prevSummary,
        subtotal: newSubtotal,
        total: newSubtotal + prevSummary.shipping - prevSummary.discount,
        itemCount: newItemCount
      }));

      return updatedItems;
    });

    // ⏳ เทคนิคที่ 2: Debounced API Synchronization (รอหยุดกด 500ms ค่อยยิง API)
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    debounceTimers.current[productId] = setTimeout(async () => {
      try {
        // 🔒 เทคนิคที่ 3: Background Revalidation (ส่ง API ไปหลังบ้านเงียบๆ เพื่อยืนยันความถูกต้อง)
        const res = await updateCartQuantityApi(productId, quantity);
        if (res.success) {
          syncCartState(res); // สวมทับข้อมูลจาก Backend เพื่อรับรองความถูกต้อง 100%
        }
      } catch (error) {
        toast.error("อัปเดตจำนวนไม่สำเร็จ ระบบกำลังซิงค์ข้อมูลใหม่");
        fetchCart(); // Fallback: ดึงข้อมูลที่ถูกต้องกลับมาหาก API ล้มเหลว
      }
    }, 500);
  };

  // 4. ลบสินค้า
  const removeItem = async (productId) => {
    if (loading || !productId) return;

    setLoading(true);
    try {
      const res = await removeFromCartApi(productId);
      if (res.success) {
        toast.success("ลบสินค้าออกจากตะกร้าแล้ว");
        syncCartState(res); // 🚀 เร็วขึ้น 2 เท่า
      }
    } catch (error) {
      toast.error("ลบสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 5. ล้างตะกร้า (Double-Lock Step 2)
  const clearCart = async () => {
    try {
      await clearCartApi();
      setCartItems([]);
      setSummary({ subtotal: 0, shipping: 0, discount: 0, total: 0, itemCount: 0 });
    } catch (error) {
      console.error("Failed to clear cart:", error);
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
    clearCart,
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
