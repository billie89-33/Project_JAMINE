import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/contexts/AuthContext';
import { getCheckoutSummaryApi, createOrderApi, addAddressApi, deleteAddressApi } from '../services/checkoutApi';

/**
 * 🎣 useCheckout Hook
 * จัดการ Business Logic สำหรับกระบวนการสั่งซื้อ
 * ทำหน้าที่ประสานงานระหว่าง UI และ API Service
 */
export const useCheckout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod] = useState('promptpay');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    const initCheckout = async () => {
      try {
        if (!user) {
          toast.error("กรุณาเข้าสู่ระบบก่อนทำการเช็คเอาต์");
          return navigate('/login');
        }

        const res = await getCheckoutSummaryApi();
        
        if (res.success) {
          const { items, addresses, priceDetails: apiPriceDetails } = res.data;
          
          setCartItems(items);
          setAddresses(addresses);
          if (addresses.length > 0) setSelectedAddressId(addresses[0].id);

          // ✨ Trust the Backend: ใช้ยอดเงินสรุปจาก API โดยตรง ไม่คำนวณเองที่หน้าบ้าน
          setPriceDetails({
            subtotal: apiPriceDetails.subtotal,
            shipping: apiPriceDetails.shipping,
            discount: apiPriceDetails.discount,
            total: apiPriceDetails.total
          });
        }
      } catch (error) {
        console.error("Checkout Summary Error:", error);
        toast.error(error.response?.data?.message || "ดึงข้อมูลเช็คเอาต์ล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [user, navigate]);

  const submitOrder = async () => {
    if (!selectedAddressId) {
      toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🛡️ Doc 12.2: Tampering Prevention
      // ส่งเฉพาะข้อมูลที่จำเป็น Backend จะคำนวณยอดเงินเองจาก Database/Cart
      const orderPayload = {
        addressId: selectedAddressId,
        paymentMethod
      };

      const res = await createOrderApi(orderPayload);

      if (res.success) {
        toast.success("สร้างคำสั่งซื้อสำเร็จ! กรุณาชำระเงินภายในเวลาที่กำหนด");
        
        // 🚀 Doc 2.4 & API PLAN Flow 5: Navigation Security
        // ใช้เฉพาะ orderId จาก Success Response เท่านั้น
        const orderId = res.data?._id || res.data?.id;
        
        navigate(`/payment/${orderId}`, { 
          state: { 
            fromCheckout: true 
          } 
        }); 
      }
    } catch (error) {
      console.error("Submit Order Error:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถสร้างคำสั่งซื้อได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ➕ ฟังก์ชันเพิ่มที่อยู่ใหม่
  const addAddress = async (newAddressData) => {
    try {
      const res = await addAddressApi(newAddressData);
      if (res.success) {
        setAddresses(prev => [...prev, res.data]);
        setSelectedAddressId(res.data.id);
        toast.success("เพิ่มที่อยู่สำเร็จ");
      }
    } catch (error) {
      toast.error("ไม่สามารถเพิ่มที่อยู่ได้");
    }
  };

  // 🗑️ ฟังก์ชันลบที่อยู่
  const deleteAddress = async (addressId) => {
    try {
      const res = await deleteAddressApi(addressId);
      if (res.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        if (selectedAddressId === addressId) setSelectedAddressId(null);
        toast.success("ลบที่อยู่เรียบร้อย");
      }
    } catch (error) {
      toast.error("ไม่สามารถลบที่อยู่ได้");
    }
  };

  return {
    cartItems,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    priceDetails,
    loading,
    isSubmitting,
    submitOrder,
    addAddress,
    deleteAddress
  };
};
