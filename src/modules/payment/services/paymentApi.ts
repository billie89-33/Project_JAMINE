import apiClient from '@/shared/api/apiClient';
import { ApiResponse, Order } from '@/types';

/**
 * 📲 Payment API Service
 * จัดการการดึงข้อมูลคำสั่งซื้อและการจำลองการชำระเงิน
 */

/**
 * ดึงรายละเอียดคำสั่งซื้อเพื่อเตรียมชำระเงิน
 * @param {string} orderId - หมายเลขคำสั่งซื้อ
 */
export const getOrderDetailsApi = async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};

/**
 * จำลองการยืนยันยอดเงินโอน (Mock Payment)
 * @param {string} orderId - หมายเลขคำสั่งซื้อ
 */
export const mockPaymentApi = async (orderId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post(`/orders/${orderId}/mock-payment`);
    return response.data;
};
