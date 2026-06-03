import { useState, useCallback, useEffect, useMemo } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { getDashboardAll } from '@/modules/admin/services';

/**
 * 🎣 useDashboard Hook (Optimized v2.1)
 * ดึงข้อมูลรวมจากเส้น /all เพียง Request เดียว เพื่อประสิทธิภาพสูงสุด
 * แก้ไขปัญหา Dependencies ไม่คงที่และเพิ่มการตรวจสอบข้อมูล
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week');

    // 🚀 Fetch unified dashboard data
    const fetchDashboardData = useCallback(async (currentPeriod) => {
        // console.log("🔍 Fetching Dashboard Data for period:", currentPeriod);
        const res = await getDashboardAll(currentPeriod);
        return res.data;
    }, []);

    // 🛡️ Memoize options to prevent stable dependency issues in useApi
    const apiOptions = useMemo(() => ({
        showToast: false,
        onError: (msg) => console.error("Dashboard Fetch Error", msg)
    }), []);

    const { 
        loading: isLoading, 
        data: dashboardData, 
        execute 
    } = useApi(fetchDashboardData, apiOptions);

    // 🔄 Re-fetch when period changes
    useEffect(() => {
        execute(period);
    }, [period, execute]);

    // 🧩 Destructure with safety defaults (Defensive Rendering)
    const summary = useMemo(() => dashboardData?.summary || {
        balance: { value: 0, trend: '', currentPeriodValue: 0 },
        orders: { value: 0, trend: '', currentPeriodValue: 0 },
        customers: { value: 0, trend: '', currentPeriodValue: 0 }
    }, [dashboardData]);
    
    // ⚠️ Fix: Backend sends 'revenueChart' not 'revenueData'
    const revenueData = useMemo(() => dashboardData?.revenueChart || [], [dashboardData]);
    const categorySales = useMemo(() => dashboardData?.categorySales || [], [dashboardData]);
    const recentOrders = useMemo(() => dashboardData?.recentOrders || [], [dashboardData]);
    const topProducts = useMemo(() => dashboardData?.topProducts || [], [dashboardData]);
    
    // 🔔 New Alert Stats
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
