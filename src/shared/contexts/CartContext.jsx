import  { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCartApi, 
  addToCartApi, 
  updateCartQuantityApi, 
  removeFromCartApi,
  clearCartApi
} from '@/modules/cart/services/cartApi';
import toast from 'react-hot-toast';
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

      if (response.success) {
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

        const { items: rawItems, subtotal, shippingFee, total } = response.data;
        
        // 🛠️ Fix: เปลี่ยนจาก item.product เป็น item.productId ให้ตรงตาม Backend Schema
        const mappedItems = rawItems.map(item => {
          const product = item.productId; // ดึงออบเจกต์สินค้าที่ถูก Populate มาจาก Backend
          
          return {
            id: product?._id || product?.id,
            cartItemId: item._id, // ไอดีของรายการในตะกร้า (ถ้ามี)
            name: product?.modelName || product?.name || 'Unknown Product',
            brand: product?.brand || '',
            price: product?.price || 0,
            quantity: item.quantity,
            image: product?.image?.url || product?.image || 'https://via.placeholder.com/300',
            description: product?.description || '',
            stock: product?.stock || 0
          };
        });

        setCartItems(mappedItems);
        // ✨ Doc 12.3: Trust the Backend Summary (ใช้ชื่อฟิลด์ตาม Schema เป๊ะๆ)
        setSummary({
          subtotal: subtotal || 0,
          shipping: shippingFee || 0,
          discount: response.data.discount || 0,
          total: total || 0,
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

    // 🛡️ Doc 11.4: ป้องกัน Race Condition
    if (loading) return;

    setLoading(true);
    try {
      const res = await addToCartApi(productId, quantity);
      if (res.success) {
        toast.success("เพิ่มสินค้าลงตะกร้าแล้ว", { icon: '🛒' });
        await fetchCart(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 3. อัปเดตจำนวน
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1 || loading) return;
    
    setLoading(true);
    try {
      const res = await updateCartQuantityApi(productId, quantity);
      if (res.success) {
        await fetchCart();
      }
    } catch (error) {
      toast.error("อัปเดตจำนวนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  // 4. ลบสินค้า
  const removeItem = async (productId) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await removeFromCartApi(productId);
      if (res.success) {
        toast.success("ลบสินค้าออกจากตะกร้าแล้ว");
        await fetchCart();
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
