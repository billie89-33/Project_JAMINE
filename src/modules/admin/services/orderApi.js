import { apiClient } from '@/shared/api';

/**
 * 📦 Admin Order Service
 * จัดการข้อมูลออเดอร์สำหรับหน้า Admin
 */

/**
 * ดึงรายการออเดอร์ทั้งหมด พร้อมระบบ Filter และ Pagination
 * @param {Object} params - { status, page, limit }
 */
export const getAllOrders = async (params = {}) => {
    const response = await apiClient.get('/admin/orders', { params });
    return response.data;
};

/**
 * อัปเดตสถานะออเดอร์
 * @param {string} orderId 
 * @param {string} status - ['Awaiting Payment', 'Paid', 'Cancelled', 'Processing', 'Shipped', 'Delivered']
 */
export const updateOrderStatus = async (orderId, status) => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
};

/**
 * ลบออเดอร์ (Admin Only)
 */
export const deleteOrder = async (orderId) => {
    const response = await apiClient.delete(`/admin/orders/${orderId}`);
    return response.data;
};
