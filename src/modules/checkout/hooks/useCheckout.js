import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useCart } from '@/modules/cart'; // 🛒 ดึงข้อมูลจาก Context แทน
import { createOrderApi, addAddressApi, deleteAddressApi, updateAddressApi, setDefaultAddressApi } from '../services/checkoutApi';

/**
 * 🎣 useCheckout Hook
 */
export const useCheckout = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth(); // 🔄 เพิ่ม refreshUser เข้ามา
  const { cartItems, summary: cartSummary, loading: cartLoading } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod] = useState('promptpay');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨ เชื่อมต่อยอดเงินจาก Cart Summary
  const priceDetails = {
    subtotal: cartSummary.subtotal,
    shipping: cartSummary.shipping,
    discount: cartSummary.discount,
    total: cartSummary.total
  };

  // 🔄 ซิงค์ที่อยู่จาก User Profile เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (user) {
      const userAddresses = user.addresses || [];
      setAddresses(userAddresses);
      
      // ถ้ายังไม่ได้เลือกที่อยู่ ให้เลือกที่อยู่ Default หรือที่อยู่อันแรก
      if (!selectedAddressId && userAddresses.length > 0) {
        const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
        setSelectedAddressId(defaultAddr._id || defaultAddr.id);
      }
      setLoading(false);
    } else {
      setLoading(cartLoading);
    }
  }, [user, cartLoading, selectedAddressId]);

  const submitOrder = async () => {
    if (!selectedAddressId) {
      toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🛡️ Doc 12.2: Tampering Prevention
      const orderPayload = {
        addressId: selectedAddressId,
        paymentMethod
      };

      const res = await createOrderApi(orderPayload);

      if (res.success) {
        toast.success(res.message || "สร้างคำสั่งซื้อสำเร็จ!");
        
        // 🚀 Doc 2.4 & API PLAN Flow 5: Navigation Security
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

  // ➕ ฟังก์ชันเพิ่มที่อยู่ใหม่ (พร้อม Sync Global State)
  const addAddress = async (newAddressData) => {
    try {
      const res = await addAddressApi(newAddressData);
      if (res.success) {
        const updatedUser = await refreshUser();
        if (updatedUser && updatedUser.addresses) {
           const newAddr = updatedUser.addresses[updatedUser.addresses.length - 1];
           if (newAddr) setSelectedAddressId(newAddr._id || newAddr.id);
        }
        toast.success("เพิ่มที่อยู่สำเร็จ");
      }
    } catch (error) {
      toast.error("ไม่สามารถเพิ่มที่อยู่ได้");
    }
  };

  // 📝 ฟังก์ชันอัปเดตที่อยู่
  const updateAddress = async (addressId, updatedData) => {
    try {
      const res = await updateAddressApi(addressId, updatedData);
      if (res.success) {
        await refreshUser();
        toast.success("อัปเดตที่อยู่สำเร็จ");
      }
    } catch (error) {
      toast.error("ไม่สามารถอัปเดตที่อยู่ได้");
    }
  };

  // ⭐ ฟังก์ชันตั้งเป็นที่อยู่หลัก
  const setDefaultAddress = async (addressId) => {
    try {
      const res = await setDefaultAddressApi(addressId);
      if (res.success) {
        await refreshUser();
        toast.success("ตั้งเป็นที่อยู่หลักเรียบร้อย");
      }
    } catch (error) {
      toast.error("ไม่สามารถตั้งที่อยู่หลักได้");
    }
  };

  // 🗑️ ฟังก์ชันลบที่อยู่ (พร้อม Sync Global State)
  const deleteAddress = async (addressId) => {
    try {
      const res = await deleteAddressApi(addressId);
      if (res.success) {
        await refreshUser();
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
    updateAddress,
    setDefaultAddress,
    deleteAddress
  };
};
