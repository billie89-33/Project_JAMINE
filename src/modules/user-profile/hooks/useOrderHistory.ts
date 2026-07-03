import { useState, useCallback, useEffect, useMemo } from 'react';
import { Order } from '@/types';
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
    const res = apiResponse as { data?: Order[]; orders?: Order[] } | Order[];
    
    let rawOrders: Order[] = [];
    if (Array.isArray(res)) rawOrders = res;
    else if (res.data && Array.isArray(res.data)) rawOrders = res.data;
    else if (res.orders && Array.isArray(res.orders)) rawOrders = res.orders;
    
    // 🛡️ Map items to handle nested product data (similar to Cart)
    return rawOrders.map(order => ({
      ...order,
      items: order.items?.map(item => {
        // บางที backend ส่งข้อมูลสินค้ามาใน productId หรือ product (populated)
        const productObj = typeof item.productId === 'object' ? item.productId : (item as any).product;
        return {
          ...item,
          brand: item.brand || productObj?.brand || 'Unknown',
          modelName: item.modelName || productObj?.modelName || productObj?.name || 'Unknown Product',
          image: item.image || productObj?.image?.url || productObj?.image || '',
          priceAtPurchase: item.priceAtPurchase || item.price || productObj?.price || 0
        };
      }) || []
    }));
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

    return orders.filter(order => filterMap[activeFilter as keyof typeof filterMap]?.includes(order.status as never));
  }, [orders, activeFilter]);

  const getRemainingTime = useCallback((expiresAt: string | Date | undefined) => {
    if (!expiresAt) return null;
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now.getTime();
    
    if (diff <= 0) return 'Expired';

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [now]);

  const handlePayNow = (order: Order) => {
    // นำทางไปหน้า Payment พร้อมส่ง Order ID และยอดเงิน
    navigate('/payment', { 
        state: { 
            orderId: order._id, 
            totalAmount: order.total || order.totalAmount || order.total_amount 
        } 
    });
  };

  const handleTrackOrder = (trackingNumber: string) => {
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
