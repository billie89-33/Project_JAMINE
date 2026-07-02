import { apiClient } from '@/shared/api';
import { ApiResponse, Order } from '@/types';

/**
 * 🚚 Admin Shipping & Logistics Service
 * จัดการข้อมูลการจัดส่งและเลขพัสดุสำหรับ Admin
 */

export interface GetShippingOrdersParams {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedShippingOrders {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ShippingStats {
    pending?: number;
    shipped?: number;
    delivered?: number;
    total?: number;
    toShip?: number;
    toProcess?: number;
    inTransit?: number;
    completed?: number;
}

export interface QuickTrackingPayload {
    trackingNumber: string;
    status?: string;
}

/**
 * ดึงรายการออเดอร์สำหรับการจัดส่ง (คัดกรองเฉพาะที่เกี่ยวข้อง)
 * @param {GetShippingOrdersParams} params - { status, page, limit, search }
 */
export const getShippingOrders = async (params: GetShippingOrdersParams = {}): Promise<ApiResponse<PaginatedShippingOrders>> => {
    const response = await apiClient.get<ApiResponse<PaginatedShippingOrders>>('/admin/shipping/orders', { params });
    return response.data;
};

/**
 * ดึงสถิติภาพรวมของการจัดส่ง
 */
export const getShippingStats = async (): Promise<ApiResponse<ShippingStats>> => {
    const response = await apiClient.get<ApiResponse<ShippingStats>>('/admin/shipping/stats');
    return response.data;
};

/**
 * อัปเดตเลขพัสดุแบบด่วน (Quick Update)
 * @param {string} id - Order ID
 * @param {QuickTrackingPayload} data - { trackingNumber, status }
 */
export const updateQuickTracking = async (id: string, data: QuickTrackingPayload): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/admin/shipping/${id}/tracking`, data);
    return response.data;
};
