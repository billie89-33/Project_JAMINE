import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { getShippingOrders, getShippingStats, updateQuickTracking } from '../../services';

/**
 * ⚓ useShipping Hook
 * จัดการ Logic การดึงข้อมูลออเดอร์และสถิติการจัดส่ง
 */
export const useShipping = () => {
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 1,
        limit: 10
    });

    // 1. Hook สำหรับดึงสถิติ
    const statsApi = useApi(getShippingStats, {
        initialData: { toShip: 0, toProcess: 0, inTransit: 0, completed: 0 } as { toShip: number; toProcess: number; inTransit: number; completed: number },
        transform: (res) => res as any,
        showToast: true, // เปิดการแจ้งเตือน Error
        errorMessage: 'ไม่สามารถดึงข้อมูลสถิติการจัดส่งได้'
    });

    // 2. Hook สำหรับดึงรายการออเดอร์
    const ordersApi = useApi(getShippingOrders, {
        initialData: { orders: [], total: 0, page: 1, totalPages: 1 } as { orders: Record<string, string | number | boolean | object | undefined>[]; total: number; page: number; totalPages: number },
        transform: (res) => res as any,
        showToast: true, // เปิดการแจ้งเตือน Error
        errorMessage: 'ไม่สามารถดึงข้อมูลรายการจัดส่งได้'
    });

    // 3. Hook สำหรับอัปเดต Tracking ด่วน
    const updateTrackingApi = useApi(updateQuickTracking, {
        showToast: true,
        successMessage: 'อัปเดตข้อมูลการจัดส่งสำเร็จ'
    });

    // ฟังก์ชันดึงข้อมูลใหม่
    const refreshData = useCallback(async () => {
        await Promise.all([
            statsApi.execute(),
            ordersApi.execute(filters)
        ]);
    }, [filters, statsApi.execute, ordersApi.execute]);

    // ดึงข้อมูลเมื่อ filters เปลี่ยน
    useEffect(() => {
        refreshData();
    }, [filters]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleUpdateTracking = async (orderId: string, trackingData: any) => {
        await updateTrackingApi.execute(orderId, trackingData);
        refreshData(); // โหลดข้อมูลใหม่หลังจากอัปเดต
    };

    return {
        // 📊 Mapping สถิติ (Ultra-Defensive Object Mapping)
        stats: (statsApi.data as any)?.data?.stats || (statsApi.data as any)?.stats || (statsApi.data as any)?.data || statsApi.data || {},
        
        // 📦 Mapping ออเดอร์ (Ultra-Defensive Array Mapping)
        orders: Array.isArray((ordersApi.data as any)?.data?.data) ? (ordersApi.data as any).data.data :
                Array.isArray((ordersApi.data as any)?.data) ? (ordersApi.data as any).data :
                Array.isArray((ordersApi.data as any)?.orders) ? (ordersApi.data as any).orders :
                Array.isArray(ordersApi.data) ? ordersApi.data : [],
        
        total: (ordersApi.data as { total?: number })?.total || 0,
        loading: statsApi.loading || ordersApi.loading,
        updating: updateTrackingApi.loading,
        filters,
        handleFilterChange,
        handlePageChange,
        handleUpdateTracking,
        refreshData
    };
};
