import { apiClient } from '@/shared/api';

/**
 * 📊 Admin Dashboard Service
 * ศูนย์รวมคำสั่งดึงข้อมูลสถิติสำหรับหน้า Admin Dashboard
 */

/**
 * ดึงภาพรวมสถิติด้านบน (Summary Stats)
 * @param {string} period - ช่วงเวลา เช่น 'today', 'week', 'month', 'year'
 */
export const getDashboardSummary = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/summary`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลกราฟรายได้ (Revenue Chart)
 * @param {string} period - ช่วงเวลา
 */
export const getRevenueChart = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/revenue-chart`, { params: { period } });
    return response.data;
};

/**
 * ดึงข้อมูลสัดส่วนยอดขายตามหมวดหมู่ (Donut Chart)
 * @param {string} period - ช่วงเวลา
 */
export const getCategorySales = async (period = 'week') => {
    const response = await apiClient.get(`/admin/dashboard/category-sales`, { params: { period } });
    return response.data;
};

/**
 * ดึงรายการออเดอร์ล่าสุด
 * @param {number} limit - จำนวนออเดอร์ที่ต้องการ
 */
export const getRecentOrders = async (limit = 5) => {
    const response = await apiClient.get(`/admin/dashboard/recent-orders`, { params: { limit } });
    return response.data;
};

/**
 * ดึงรายการสินค้าขายดี
 * @param {number} limit - จำนวนสินค้าที่ต้องการ
 */
export const getTopProducts = async (limit = 3) => {
    const response = await apiClient.get(`/admin/dashboard/top-products`, { params: { limit } });
    return response.data;
};
