import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { getShippingOrders, getShippingStats, updateQuickTracking, GetShippingOrdersParams, PaginatedShippingOrders, ShippingStats, QuickTrackingPayload } from '../../services';
import { Order, ApiResponse } from '@/types';

/**
 * ⚓ useShipping Hook
 * จัดการ Logic การดึงข้อมูลออเดอร์และสถิติการจัดส่ง
 */
export const useShipping = () => {
    const [filters, setFilters] = useState<GetShippingOrdersParams>({
        status: '',
        search: '',
        page: 1,
        limit: 10
    });

    // 1. Hook สำหรับดึงสถิติ
    const statsApi = useApi<ShippingStats, [], ApiResponse<ShippingStats>>(getShippingStats, {
        initialData: { toShip: 0, toProcess: 0, inTransit: 0, completed: 0 },
        showToast: true,
        errorMessage: 'ไม่สามารถดึงข้อมูลสถิติการจัดส่งได้'
    });

    // 2. Hook สำหรับดึงรายการออเดอร์
    const ordersApi = useApi<PaginatedShippingOrders, [GetShippingOrdersParams?], ApiResponse<PaginatedShippingOrders>>(getShippingOrders, {
        initialData: { orders: [], total: 0, page: 1, totalPages: 1 },
        showToast: true,
        errorMessage: 'ไม่สามารถดึงข้อมูลรายการจัดส่งได้'
    });

    // 3. Hook สำหรับอัปเดต Tracking ด่วน
    const updateTrackingApi = useApi<Order, [string, QuickTrackingPayload], ApiResponse<Order>>(updateQuickTracking, {
        showToast: true,
        successMessage: 'อัปเดตข้อมูลการจัดส่งสำเร็จ'
    });

    // ฟังก์ชันดึงข้อมูลใหม่
    const refreshData = useCallback(async () => {
        await Promise.all([
            statsApi.execute(),
            ordersApi.execute(filters)
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, statsApi.execute, ordersApi.execute]);

    // ดึงข้อมูลเมื่อ filters เปลี่ยน
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleFilterChange = (newFilters: Partial<GetShippingOrdersParams>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleUpdateTracking = async (orderId: string, trackingData: QuickTrackingPayload) => {
        await updateTrackingApi.execute(orderId, trackingData);
        refreshData(); // โหลดข้อมูลใหม่หลังจากอัปเดต
    };

    // Defensive helper variables to ensure safe mapping
    const rawStats = statsApi.data as unknown as Record<string, unknown>;
    const rawOrdersData = ordersApi.data as unknown as Record<string, unknown>;

    return {
        // 📊 Mapping สถิติ (Ultra-Defensive Object Mapping with type safety)
        stats: (rawStats?.stats as ShippingStats) || (rawStats?.data as ShippingStats) || statsApi.data || {},
        
        // 📦 Mapping ออเดอร์ (Ultra-Defensive Array Mapping with type safety)
        orders: Array.isArray(rawOrdersData?.data) ? rawOrdersData.data as Order[] :
                Array.isArray(rawOrdersData?.orders) ? rawOrdersData.orders as Order[] :
                Array.isArray(ordersApi.data) ? ordersApi.data as Order[] : [],
        
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
