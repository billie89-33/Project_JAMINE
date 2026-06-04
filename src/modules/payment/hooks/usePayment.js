import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getOrderDetailsApi, mockPaymentApi } from '../services/paymentApi';
import { useCart } from '@/shared/contexts/CartContext';

/**
 * 🎣 usePayment Hook
 * จัดการ Business Logic สำหรับหน้าชำระเงิน (Resilient Implementation)
 */
export const usePayment = () => {
  const navigate = useNavigate();
  const { orderId } = useParams(); // 🛠️ Resilience: ดึงจาก URL แทนการพึ่งพาแค่ location.state
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
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
        toast.error(error.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
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
        toast.success("ระบบยืนยันยอดเงินสำเร็จ! กำลังพาท่านกลับหน้าหลัก");
        
        // 🔄 Doc 11.7: Double-Lock Cart Clearing (Step 2 - Frontend explicit clear)
        await clearCart(); 
        
        // นำทางกลับหน้าแรก (หรือหน้าประวัติคำสั่งซื้อ)
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("Verify Payment Error:", error);
      toast.error(error.response?.data?.message || "การยืนยันยอดเงินล้มเหลว");
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
