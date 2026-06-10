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
    data: orders = [], 
    loading: isLoading, 
    execute: fetchOrders 
  } = useApi(getMyOrdersApi);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. อัปเดตเวลาปัจจุบันทุกวินาที (สำหรับตัวนับถอยหลัง)
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. กรองข้อมูลตาม Tab
  const filteredOrders = useMemo(() => {
    const safeOrders = orders || [];
    if (activeFilter === 'all') return safeOrders;
    
    // Mapping Filter Tabs -> Order Statuses
    const filterMap = {
      pending: [ORDER_STATUS.PENDING],
      shipping: [ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED],
      completed: [ORDER_STATUS.DELIVERED],
      cancelled: [ORDER_STATUS.CANCELLED]
    };

    return safeOrders.filter(order => filterMap[activeFilter]?.includes(order.status));
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
