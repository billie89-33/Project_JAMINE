import { apiClient } from '@/shared/api';
import { ApiResponse, Order } from '@/types';

/**
 * 📦 Admin Order Service
 * จัดการข้อมูลออเดอร์สำหรับหน้า Admin
 */

export interface GetOrdersParams {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    keyword?: string;
    userId?: string;
}

export interface PaginatedOrders {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
}

export interface UpdateOrderStatusPayload {
    status: string;
    trackingNumber?: string;
}

/**
 * ดึงรายการออเดอร์ทั้งหมด พร้อมระบบ Filter และ Pagination
 * @param {GetOrdersParams} params - { status, page, limit }
 */
export const getAllOrders = async (params: GetOrdersParams = {}): Promise<ApiResponse<PaginatedOrders>> => {
    const response = await apiClient.get<ApiResponse<PaginatedOrders>>('/admin/orders', { params });
    return response.data;
};

/**
 * ดึงรายละเอียดออเดอร์เดียว
 * @param {string} orderId 
 */
export const getOrderByIdApi = async (orderId: string): Promise<ApiResponse<Order>> => {
    // 🛡️ ใช้ /orders/:id แทน /admin/orders/:id เพื่อใช้ Shared Endpoint
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
};

/**
 * อัปเดตสถานะออเดอร์ (รองรับการใส่ Tracking Number)
 * @param {string} orderId 
 * @param {UpdateOrderStatusPayload} payload - { status: string, trackingNumber?: string }
 */
export const updateOrderStatus = async (orderId: string, payload: UpdateOrderStatusPayload): Promise<ApiResponse<Order>> => {
    // payload ต้องมีโครงสร้าง { status: 'Shipped', trackingNumber: '...' }
    const response = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, payload);
    return response.data;
};

/**
 * ลบออเดอร์ (Admin Only)
 */
export const deleteOrder = async (orderId: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/orders/${orderId}`);
    return response.data;
};
