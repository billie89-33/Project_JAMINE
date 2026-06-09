import apiClient from '@/shared/api/apiClient';

/**
 * 📦 Checkout API Service
 * จัดการการติดต่อสื่อสารกับ Backend สำหรับระบบการสั่งซื้อ
 */

// --- REAL API ENDPOINTS ---

/**
 * ดึงข้อมูลสรุปสำหรับการเช็คเอาต์ (Cart + Addresses + Final Prices)
 */
export const getCheckoutSummaryApi = async () => {
    const response = await apiClient.get('/checkout/summary');
    return response.data;
};

/**
 * สร้างคำสั่งซื้อใหม่ (ส่งเฉพาะ addressId และ paymentMethod)
 */
export const createOrderApi = async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
};

/**
 * เพิ่มที่อยู่จัดส่งใหม่
 */
export const addAddressApi = async (newAddress) => {
    const response = await apiClient.post('/users/addresses', newAddress);
    return response.data;
};

/**
 * อัปเดตที่อยู่จัดส่งเดิม
 */
export const updateAddressApi = async (addressId, updatedData) => {
    const response = await apiClient.put(`/users/addresses/${addressId}`, updatedData);
    return response.data;
};

/**
 * ตั้งค่าที่อยู่เป็นที่อยู่หลัก (Default)
 */
export const setDefaultAddressApi = async (addressId) => {
    const response = await apiClient.patch(`/users/addresses/${addressId}/default`);
    return response.data;
};

/**
 * ลบที่อยู่จัดส่ง
 */
export const deleteAddressApi = async (addressId) => {
    const response = await apiClient.delete(`/users/addresses/${addressId}`);
    return response.data;
};
