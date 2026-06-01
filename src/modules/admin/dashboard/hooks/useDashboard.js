import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * 🎣 useDashboard Hook
 * จัดการข้อมูลสำหรับหน้า Admin Dashboard เตรียมพร้อมสำหรับต่อ API จริง
 */
export const useDashboard = () => {
    const [period, setPeriod] = useState('week'); // today, week, month, year
    const [isLoading, setIsLoading] = useState(false);

    // Mock data structures matching the API Mapping (14-dashboard-api-mapping.md)
    const [summary, setSummary] = useState({
        balance: { value: 124500, trend: '+15%' },
        orders: { value: 1240, trend: '+5%' },
        customers: { value: 342, trend: '-2%' }
    });

    const [revenueData, setRevenueData] = useState([
        { date: "25 May", revenue: 15000 },
        { date: "26 May", revenue: 22000 },
        { date: "27 May", revenue: 18500 },
        { date: "28 May", revenue: 25000 },
        { date: "29 May", revenue: 21000 },
        { date: "30 May", revenue: 28000 },
        { date: "31 May", revenue: 24000 }
    ]);

    const [categorySales, setCategorySales] = useState([
        { category: "Notebook", sales: 45, color: "bg-purple-600" },
        { category: "Keyboard", sales: 30, color: "bg-indigo-500" },
        { category: "Monitor", sales: 25, color: "bg-blue-400" },
        { category: "Mouse", sales: 15, color: "bg-cyan-400" }
    ]);

    const [recentOrders, setRecentOrders] = useState([
        { _id: "ORD-001", customerName: "John Doe", amount: 5000, status: "Pending", date: "2026-06-01T10:00:00Z" },
        { _id: "ORD-002", customerName: "Jane Smith", amount: 1500, status: "Shipped", date: "2026-06-01T09:30:00Z" },
        { _id: "ORD-003", customerName: "Bob Johnson", amount: 12500, status: "Delivered", date: "2026-05-31T14:20:00Z" },
        { _id: "ORD-004", customerName: "Alice Brown", amount: 800, status: "Processing", date: "2026-05-31T11:15:00Z" },
        { _id: "ORD-005", customerName: "Charlie Davis", amount: 3200, status: "Pending", date: "2026-05-30T16:45:00Z" }
    ]);

    const [topProducts, setTopProducts] = useState([
        { _id: "PROD-A", name: "Keychron K8 Wireless Mechanical Keyboard", price: 3500, sold: 120, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200" },
        { _id: "PROD-B", name: "Macbook Air M3 2024", price: 39900, sold: 85, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200" },
        { _id: "PROD-C", name: "Logitech G Pro X Superlight", price: 4990, sold: 64, image: "https://images.unsplash.com/photo-1527814050087-379381547961?auto=format&fit=crop&q=80&w=200" }
    ]);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // MOCK API DELAY
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 📝 ในอนาคต ให้เรียกใช้ API จริงที่นี่
            /*
            const [summaryRes, revenueRes, categoryRes, ordersRes, productsRes] = await Promise.all([
                apiClient.get(`/admin/dashboard/summary?period=${period}`),
                apiClient.get(`/admin/dashboard/revenue-chart?period=${period}`),
                apiClient.get(`/admin/dashboard/category-sales?period=${period}`),
                apiClient.get(`/admin/dashboard/recent-orders?limit=5`),
                apiClient.get(`/admin/dashboard/top-products?limit=3`)
            ]);
            setSummary(summaryRes.data);
            ...
            */
        } catch (error) {
            console.error("Dashboard Fetch Error", error);
            toast.error("โหลดข้อมูล Dashboard ไม่สำเร็จ");
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
