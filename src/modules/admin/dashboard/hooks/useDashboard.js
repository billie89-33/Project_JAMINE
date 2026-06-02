import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { 
    getDashboardSummary, 
    getRevenueChart, 
    getCategorySales, 
    getRecentOrders, 
    getTopProducts 
} from '@/modules/admin/services';

/**
 * 🎣 useDashboard Hook
 * จัดการข้อมูลสำหรับหน้า Admin Dashboard โดยใช้ useApi pattern
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week');

    // 🚀 Aggregate function for fetching all dashboard data in parallel
    const fetchAllDashboardData = useCallback(async (currentPeriod) => {
        const [
            summaryRes, 
            revenueRes, 
            categoryRes, 
            ordersRes, 
            productsRes
        ] = await Promise.all([
            getDashboardSummary(currentPeriod),
            getRevenueChart(currentPeriod),
            getCategorySales(currentPeriod),
            getRecentOrders(5),
            getTopProducts(3)
        ]);

        return {
            summary: summaryRes?.data,
            revenueData: revenueRes?.data,
            categorySales: categoryRes?.data,
            recentOrders: ordersRes?.data,
            topProducts: productsRes?.data
        };
    }, []);

    // 🧹 Use the centralized useApi hook
    const { 
        loading: isLoading, 
        data: dashboardData, 
        execute 
    } = useApi(fetchAllDashboardData, {
        showToast: false, // Dashboard fetches happen automatically, no toast needed on success
        onError: (msg) => {
            console.error("Dashboard Fetch Error", msg);
        }
    });

    // 🔄 Initial fetch and fetch on period change
    useEffect(() => {
        execute(period);
    }, [period, execute]);

    // 🧩 Destructure data with safety defaults
    const summary = dashboardData?.summary || {
        balance: { value: 0, trend: '' },
        orders: { value: 0, trend: '' },
        customers: { value: 0, trend: '' }
    };
    
    const revenueData = dashboardData?.revenueData || [];
    const categorySales = dashboardData?.categorySales || [];
    const recentOrders = dashboardData?.recentOrders || [];
    const topProducts = dashboardData?.topProducts || [];

    return {
        period,
        setPeriod,
        isLoading,
        summary,
        revenueData,
        categorySales,
        recentOrders,
        topProducts
    };
};
