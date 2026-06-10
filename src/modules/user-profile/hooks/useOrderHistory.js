import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getMyOrdersApi } from '../services/profileApi';
import { ORDER_STATUS } from '@/shared/constants';

/**
 * 🎣 useOrderHistory Hook
 * จัดการ Logic ของรายการออเดอร์ฝั่ง User
 * รองรับ: Filter Status, Expiry Timer, Pay Now Action
 */
export const useOrderHistory = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveTab] = useState('all');
  const [now, setNow] = useState(new Date());

  // 1. ดึงข้อมูลออเดอร์
  const { 
    data: apiResponse, 
    loading: isLoading, 
    execute: fetchOrders 
  } = useApi(getMyOrdersApi, {
    transform: (res) => res // 🛡️ เอาตัวดิบมาจัดการเองเพื่อความชัวร์
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 1.1 สกัดข้อมูลออเดอร์ออกมาอย่างระมัดระวัง (Ultra-Defensive)
  const orders = useMemo(() => {
    if (!apiResponse) return [];
    // ถ้าเป็น Array โดยตรง
    if (Array.isArray(apiResponse)) return apiResponse;
    // ถ้าห่อมาใน .data (ตามมาตรฐาน useApi/Axios)
    if (apiResponse.data && Array.isArray(apiResponse.data)) return apiResponse.data;
    // ถ้าห่อมาใน .orders (Fallback)
    if (apiResponse.orders && Array.isArray(apiResponse.orders)) return apiResponse.orders;
    return [];
  }, [apiResponse]);

  // 2. อัปเดตเวลาปัจจุบันทุกวินาที (สำหรับตัวนับถอยหลัง)
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. กรองข้อมูลตาม Tab
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return orders;
    
    // Mapping Filter Tabs -> Order Statuses
    const filterMap = {
      pending: [ORDER_STATUS.PENDING],
      // ✅ เพิ่ม PAID เข้ามาในกลุ่ม Shipping เพราะจ่ายแล้วเตรียมส่ง
      shipping: [ORDER_STATUS.PAID, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED], 
      completed: [ORDER_STATUS.DELIVERED],
      cancelled: [ORDER_STATUS.CANCELLED]
    };

    return orders.filter(order => filterMap[activeFilter]?.includes(order.status));
  }, [orders, activeFilter]);

  // 4. คำนวณเวลาที่เหลือ (15 นาที)
  const getRemainingTime = useCallback((expiresAt) => {
    if (!expiresAt) return null;
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [now]);

  // 5. Action Handlers
  const handlePayNow = (order) => {
    // นำทางไปหน้า Payment พร้อมส่ง Order ID และยอดเงิน
    navigate('/payment', { 
        state: { 
            orderId: order._id, 
            totalAmount: order.total || order.totalAmount || order.total_amount 
        } 
    });
  };

  const handleTrackOrder = (trackingNumber) => {
    if (!trackingNumber) return;
    // ลิงก์ไปเว็บเช็คพัสดุ (จำลอง)
    window.open(`https://track.jamine.com/${trackingNumber}`, '_blank');
  };

  return {
    orders: filteredOrders,
    isLoading,
    activeFilter,
    setActiveTab,
    getRemainingTime,
    handlePayNow,
    handleTrackOrder,
    refreshOrders: fetchOrders
  };
};
