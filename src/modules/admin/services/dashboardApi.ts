import { apiClient } from '@/shared/api';
import { ApiResponse, Order, Product } from '@/types';

/**
 * 📊 Admin Dashboard Service (Optimized v2)
 * ศูนย์รวมคำสั่งดึงข้อมูลสถิติสำหรับหน้า Admin Dashboard
 * อ้างอิงตามเอกสาร Mapping ฉบับที่ 14
 */

export interface StatValue {
    value: number;
    trend: string;
    allTimeValue: number;
}

export interface DashboardSummary {
    balance: StatValue;
    orders: StatValue;
    customers: StatValue;
}

export interface RevenueChartData {
    date: string;
    revenue: number;
}

export interface CategorySalesData {
    category: string;
    sales: number;
    percentage: number;
}

export interface OrderStatusStat {
    status: string;
    count: number;
}

export interface DashboardAllData {
    summary: DashboardSummary;
    revenueChart: RevenueChartData[];
    categorySales: CategorySalesData[];
    recentOrders: Order[];
    topProducts: Product[];
    lowStock: Product[];
    orderStatus: OrderStatusStat[];
    userGrowth: any; // Or specific type if we know it
}

/**
 * 🚀 ดึงข้อมูลทุกอย่างใน Request เดียว (High Performance)
 * รวม Summary, Charts, Categories, Recent Orders, Top Products, Low Stock
 * @param {string} period - ช่วงเวลา เช่น 'today', 'week', 'month', 'year'
 */
export const getDashboardAll = async (period: string = 'week'): Promise<ApiResponse<DashboardAllData>> => {
    const response = await apiClient.get<ApiResponse<DashboardAllData>>(`/admin/dashboard/all`, { params: { period } });
    return response.data;
};

/**
 * ดึงภาพรวมสถิติด้านบน (Summary Stats)
 */
export const getDashboardSummary = async (period: string = 'week'): Promise<ApiResponse<DashboardSummary>> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>(`/admin/dashboard/summary`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลกราฟรายได้ (Revenue Chart)
 */
export const getRevenueChart = async (period: string = 'week'): Promise<ApiResponse<RevenueChartData[]>> => {
    const response = await apiClient.get<ApiResponse<RevenueChartData[]>>(`/admin/dashboard/revenue-chart`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลสัดส่วนยอดขายตามหมวดหมู่ (Donut Chart)
 */
export const getCategorySales = async (period: string = 'week'): Promise<ApiResponse<CategorySalesData[]>> => {
    const response = await apiClient.get<ApiResponse<CategorySalesData[]>>(`/admin/dashboard/category-sales`, { params: { period } });
    return response.data;
};

/**
 * ดึงรายการออเดอร์ล่าสุด
 */
export const getRecentOrders = async (limit: number = 5): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(`/admin/dashboard/recent-orders`, { params: { limit } });
    return response.data;
};

/**
 * ดึงรายการสินค้าขายดี
 */
export const getTopProducts = async (limit: number = 3): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/admin/dashboard/top-products`, { params: { limit } });
    return response.data;
};

/**
 * 🔔 ดึงรายการสินค้าสต็อกต่ำ
 */
export const getLowStock = async (threshold: number = 5): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/admin/dashboard/low-stock`, { params: { threshold } });
    return response.data;
};

/**
 * 📈 ดึงสถิติสถานะออเดอร์
 */
export const getOrderStatusStats = async (): Promise<ApiResponse<OrderStatusStat[]>> => {
    const response = await apiClient.get<ApiResponse<OrderStatusStat[]>>(`/admin/dashboard/order-status`);
    return response.data;
};
