import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    getDashboardSummary, 
    getRevenueChart, 
    getCategorySales, 
    getRecentOrders, 
    getTopProducts 
} from '@/modules/admin/services';

/**
 * 🎣 useDashboard Hook
 * จัดการข้อมูลสำหรับหน้า Admin Dashboard โดยเชื่อมต่อกับ API จริง
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week'); // today, week, month, year
    const [isLoading, setIsLoading] = useState(false);

    const [summary, setSummary] = useState({
        balance: { value: 0, trend: '' },
        orders: { value: 0, trend: '' },
        customers: { value: 0, trend: '' }
    });

    const [revenueData, setRevenueData] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // ยิง API พร้อมกันทุกเส้นเพื่อลดเวลาการรอ (Parallel Requests)
            const [
                summaryRes, 
                revenueRes, 
                categoryRes, 
                ordersRes, 
                productsRes
            ] = await Promise.all([
                getDashboardSummary(period),
                getRevenueChart(period),
                getCategorySales(period),
                getRecentOrders(5),
                getTopProducts(3)
            ]);

            // นำข้อมูลที่ได้ไปอัปเดต State (เช็คว่ามี response.data ตามโครงสร้างที่เราตกลงกันไว้)
            if (summaryRes?.data) setSummary(summaryRes.data);
            if (revenueRes?.data) setRevenueData(revenueRes.data);
            if (categoryRes?.data) setCategorySales(categoryRes.data);
            if (ordersRes?.data) setRecentOrders(ordersRes.data);
            if (productsRes?.data) setTopProducts(productsRes.data);

        } catch (error) {
            console.error("Dashboard Fetch Error", error);
            toast.error("โหลดข้อมูล Dashboard ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

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
