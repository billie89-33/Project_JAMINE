import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { getDashboardAll } from '@/modules/admin/services';

/**
 * 🎣 useDashboard Hook (Optimized v2)
 * ดึงข้อมูลรวมจากเส้น /all เพียง Request เดียว เพื่อประสิทธิภาพสูงสุด
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week');

    // 🚀 Fetch unified dashboard data
    const fetchDashboardData = useCallback(async (currentPeriod) => {
        const res = await getDashboardAll(currentPeriod);
        return res.data;
    }, []);

    const { 
        loading: isLoading, 
        data: dashboardData, 
        execute 
    } = useApi(fetchDashboardData, {
        showToast: false,
        onError: (msg) => console.error("Dashboard Fetch Error", msg)
    });

    useEffect(() => {
        execute(period);
    }, [period, execute]);

    // 🧩 Destructure with safety defaults (Defensive Rendering)
    const summary = dashboardData?.summary || {
        balance: { value: 0, trend: '', currentPeriodValue: 0 },
        orders: { value: 0, trend: '', currentPeriodValue: 0 },
        customers: { value: 0, trend: '', currentPeriodValue: 0 }
    };
    
    const revenueData = dashboardData?.revenueData || [];
    const categorySales = dashboardData?.categorySales || [];
    const recentOrders = dashboardData?.recentOrders || [];
    const topProducts = dashboardData?.topProducts || [];
    
    // 🔔 New Alert Stats (From /all response)
    const lowStockCount = dashboardData?.lowStockCount || 0;
    const pendingOrdersCount = dashboardData?.pendingOrdersCount || 0;

    return {
        period,
        setPeriod,
        isLoading,
        summary,
        revenueData,
        categorySales,
        recentOrders,
        topProducts,
        lowStockCount,
        pendingOrdersCount
    };
};
