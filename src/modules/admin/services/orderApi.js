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
 * ดึงรายละเอียดออเดอร์เดียว
 * @param {string} orderId 
 */
export const getOrderByIdApi = async (orderId) => {
    // 🛡️ สำหรับ Admin ต้องระบุ /admin/orders/:id เพื่อให้ Backend ดึงข้อมูลได้ครบถ้วน
    const response = await apiClient.get(`/admin/orders/${orderId}`);
    return response.data;
};

/**
 * อัปเดตสถานะออเดอร์ (รองรับการใส่ Tracking Number)
 * @param {string} orderId 
 * @param {Object} payload - { status: string, trackingNumber?: string }
 */
export const updateOrderStatus = async (orderId, payload) => {
    // payload ต้องมีโครงสร้าง { status: 'Shipped', trackingNumber: '...' }
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, payload);
    return response.data;
};

/**
 * ลบออเดอร์ (Admin Only)
 */
export const deleteOrder = async (orderId) => {
    const response = await apiClient.delete(`/admin/orders/${orderId}`);
    return response.data;
};
