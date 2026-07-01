import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getOrderDetailsApi, mockPaymentApi } from '../services/paymentApi';
import { useCart } from '@/shared/contexts/CartContext';
import { Order } from '@/types';

/**
 * 🎣 usePayment Hook
 * จัดการ Business Logic สำหรับหน้าชำระเงิน (Resilient Implementation)
 */
export const usePayment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // 🛠️ Resilience: ดึงจาก URL แทนการพึ่งพาแค่ location.state
  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // 🚨 Security & Step Integrity
      if (!orderId) {
        toast.error("ไม่พบข้อมูลคำสั่งซื้อ");
        return navigate('/');
      }

      try {
        const res = await getOrderDetailsApi(orderId);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (error) {
        console.error("Fetch Order Details Error:", error);
        toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const verifyPayment = async () => {
    if (!order) return;

    setIsVerifying(true);
    try {
      // 🛡️ ยืนยันยอดโอนจำลองไปยัง Backend
      const res = await mockPaymentApi(order._id || order.id);
      
      if (res.success) {
        toast.success(`ชำระเงินออเดอร์ ${order.orderNumber} สำเร็จ! ✨`);
        
        // 🔄 API PLAN Skill 3: Double-Lock Cart Clearing (Lock ชั้นที่ 2)
        // ยิง API เคลียร์ตะกร้าซ้ำเพื่อความชัวร์ 100% ก่อนไปหน้า Success
        try {
          await clearCart(); 
        } catch (clearErr) {
          console.warn("Frontend Clear Cart Warning (Optional step):", clearErr);
        }
        
        // ✅ เปลี่ยนจากหน้าแรก เป็นหน้าประวัติการสั่งซื้อเพื่อให้ลูกค้าเห็นสถานะที่อัปเดต
        setTimeout(() => {
          navigate('/profile?tab=orders', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error("Verify Payment Error:", error);
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "การยืนยันยอดเงินล้มเหลว");
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    order,
    loading,
    isVerifying,
    verifyPayment
  };
};
