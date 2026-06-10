import { apiClient } from '@/shared/api';

/**
 * 🚚 Admin Shipping & Logistics Service
 * จัดการข้อมูลการจัดส่งและเลขพัสดุสำหรับ Admin
 */

/**
 * ดึงรายการออเดอร์สำหรับการจัดส่ง (คัดกรองเฉพาะที่เกี่ยวข้อง)
 * @param {Object} params - { status, page, limit, search }
 */
export const getShippingOrders = async (params = {}) => {
    const response = await apiClient.get('/admin/shipping/orders', { params });
    return response.data;
};

/**
 * ดึงสถิติภาพรวมของการจัดส่ง
 */
export const getShippingStats = async () => {
    const response = await apiClient.get('/admin/shipping/stats');
    return response.data;
};

/**
 * อัปเดตเลขพัสดุแบบด่วน (Quick Update)
 * @param {string} id - Order ID
 * @param {Object} data - { trackingNumber, status }
 */
export const updateQuickTracking = async (id, data) => {
    const response = await apiClient.patch(`/admin/shipping/${id}/tracking`, data);
    return response.data;
};
