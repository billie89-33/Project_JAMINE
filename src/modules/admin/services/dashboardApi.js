import { apiClient } from '@/shared/api';

/**
 * 📊 Admin Dashboard Service (Optimized v2)
 * ศูนย์รวมคำสั่งดึงข้อมูลสถิติสำหรับหน้า Admin Dashboard
 * อ้างอิงตามเอกสาร Mapping ฉบับที่ 14
 */

/**
 * 🚀 ดึงข้อมูลทุกอย่างใน Request เดียว (High Performance)
 * รวม Summary, Charts, Categories, Recent Orders, Top Products, Low Stock
 * @param {string} period - ช่วงเวลา เช่น 'today', 'week', 'month', 'year'
 */
export const getDashboardAll = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/all`, { params: { period } });
    return response.data;
};

/**
 * ดึงภาพรวมสถิติด้านบน (Summary Stats)
 */
export const getDashboardSummary = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/summary`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลกราฟรายได้ (Revenue Chart)
 */
export const getRevenueChart = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/revenue-chart`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลสัดส่วนยอดขายตามหมวดหมู่ (Donut Chart)
 */
export const getCategorySales = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/category-sales`, { params: { period } });
    return response.data;
};

/**
 * ดึงรายการออเดอร์ล่าสุด
 */
export const getRecentOrders = async (limit = 5) => {
    const response = await apiClient.get(`/admin/dashboard/recent-orders`, { params: { limit } });
    return response.data;
};

/**
 * ดึงรายการสินค้าขายดี
 */
export const getTopProducts = async (limit = 3) => {
    const response = await apiClient.get(`/admin/dashboard/top-products`, { params: { limit } });
    return response.data;
};

/**
 * 🔔 ดึงรายการสินค้าสต็อกต่ำ
 */
export const getLowStock = async (threshold = 5) => {
    const response = await apiClient.get(`/admin/dashboard/low-stock`, { params: { threshold } });
    return response.data;
};

/**
 * 📈 ดึงสถิติสถานะออเดอร์
 */
export const getOrderStatusStats = async () => {
    const response = await apiClient.get(`/admin/dashboard/order-status`);
    return response.data;
};
