import apiClient from '@/shared/api/apiClient';

/**
 * 📲 Payment API Service
 * จัดการการดึงข้อมูลคำสั่งซื้อและการจำลองการชำระเงิน
 */

/**
 * ดึงรายละเอียดคำสั่งซื้อเพื่อเตรียมชำระเงิน
 * @param {string} orderId - หมายเลขคำสั่งซื้อ
 */
export const getOrderDetailsApi = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};

/**
 * จำลองการยืนยันยอดเงินโอน (Mock Payment)
 * @param {string} orderId - หมายเลขคำสั่งซื้อ
 */
export const mockPaymentApi = async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/mock-payment`);
    return response.data;
};
