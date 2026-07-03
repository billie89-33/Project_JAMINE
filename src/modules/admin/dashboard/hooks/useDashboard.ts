import { useState, useCallback, useEffect, useMemo } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { getDashboardAll, DashboardAllData } from '@/modules/admin/services';

/**
 * 🎣 useDashboard Hook (Optimized v2.1)
 * ดึงข้อมูลรวมจากเส้น /all เพียง Request เดียว เพื่อประสิทธิภาพสูงสุด
 * แก้ไขปัญหา Dependencies ไม่คงที่และเพิ่มการตรวจสอบข้อมูล
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week');

    // 🚀 Fetch unified dashboard data
    const fetchDashboardData = useCallback(async (currentPeriod: string) => {
        // console.log("🔍 Fetching Dashboard Data for period:", currentPeriod);
        const res = await getDashboardAll(currentPeriod);
        return res.data;
    }, []);

    // 🛡️ Memoize options to prevent stable dependency issues in useApi
    const apiOptions = useMemo(() => ({
        showToast: false,
        onError: (msg: string | Error) => console.error("Dashboard Fetch Error", msg)
    }), []);

    const { 
        loading: isLoading, 
        data, 
        execute 
    } = useApi(fetchDashboardData, apiOptions);

    const dashboardData = data as DashboardAllData | null | undefined;

    // 🔄 Re-fetch when period changes
    useEffect(() => {
        execute(period);
    }, [period, execute]);

    // 🧩 Destructure with safety defaults (Defensive Rendering)
    const summary = useMemo(() => dashboardData?.summary || {
        balance: { value: 0, trend: '', allTimeValue: 0 },
        orders: { value: 0, trend: '', allTimeValue: 0 },
        customers: { value: 0, trend: '', allTimeValue: 0 }
    }, [dashboardData]);
    
    // ⚠️ Fix: Backend sends 'revenueChart' not 'revenueData'
    const revenueData = useMemo(() => dashboardData?.revenueChart || [], [dashboardData]);
    const categorySales = useMemo(() => dashboardData?.categorySales || [], [dashboardData]);
    const recentOrders = useMemo(() => dashboardData?.recentOrders || [], [dashboardData]);
    const topProducts = useMemo(() => dashboardData?.topProducts || [], [dashboardData]);
    const lowStock = useMemo(() => dashboardData?.lowStock || [], [dashboardData]);
    
    // 🔔 New Alert Stats (Calculated from arrays or API fields)
    const lowStockCount = useMemo(() => lowStock.length, [lowStock]);
    const orderStatus = useMemo(() => dashboardData?.orderStatus || [], [dashboardData]);
    const userGrowth = useMemo(() => dashboardData?.userGrowth || [], [dashboardData]);
    
    // Fix: คำนวณ Pending Orders ด้วยตัวเองเพราะ Backend ไม่ได้ส่งยอดนี้มาโดยตรง
    const pendingOrdersCount = useMemo(() => {
        const pending = orderStatus.find(s => s.status === 'Awaiting Payment');
        return pending ? pending.count : 0;
    }, [orderStatus]);

    return {
        period,
        setPeriod,
        isLoading,
        summary,
        revenueData,
        categorySales,
        recentOrders,
        topProducts,
        lowStock,
        orderStatus,
        userGrowth, // 👈 ส่ง userGrowth ออกไปใช้
        lowStockCount,
        pendingOrdersCount
    };
};
