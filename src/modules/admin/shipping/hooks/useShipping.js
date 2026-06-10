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
        initialData: { toShip: 0, toProcess: 0, inTransit: 0, completed: 0 },
        transform: (res) => res,
        showToast: true, // เปิดการแจ้งเตือน Error
        errorMessage: 'ไม่สามารถดึงข้อมูลสถิติการจัดส่งได้'
    });

    // 2. Hook สำหรับดึงรายการออเดอร์
    const ordersApi = useApi(getShippingOrders, {
        initialData: { data: [], total: 0 },
        transform: (res) => res,
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

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleUpdateTracking = async (orderId, trackingData) => {
        await updateTrackingApi.execute(orderId, trackingData);
        refreshData(); // โหลดข้อมูลใหม่หลังจากอัปเดต
    };

    return {
        // 📊 Mapping สถิติ (รองรับทั้ง .data.stats, .stats หรือ .data)
        stats: statsApi.data?.stats || statsApi.data?.data || statsApi.data,
        
        // 📦 Mapping ออเดอร์ (รองรับทั้ง .data.data, .data หรือ Array ตรงๆ)
        orders: ordersApi.data?.data || (Array.isArray(ordersApi.data) ? ordersApi.data : []),
        
        total: ordersApi.data?.total || 0,
        loading: statsApi.loading || ordersApi.loading,
        updating: updateTrackingApi.loading,
        filters,
        handleFilterChange,
        handlePageChange,
        handleUpdateTracking,
        refreshData
    };
};
