import { apiClient } from '@/shared/api';

/**
 * 🛒 Cart API Service
 * จัดการข้อมูลตะกร้าสินค้าผ่าน Backend API
 * (หมายเหตุ: เส้นทางเหล่านี้ต้องการการ Login ก่อนใช้งาน)
 */

/**
 * ดึงข้อมูลสินค้าในตะกร้าทั้งหมด
 */
export const getCartApi = async () => {
    const response = await apiClient.get('/cart');
    return response.data;
};

/**
 * เพิ่มสินค้าลงในตะกร้า
 * @param {string} productId - ไอดีสินค้า
 * @param {number} quantity - จำนวน
 */
export const addToCartApi = async (productId, quantity = 1) => {
    const response = await apiClient.post('/cart', { productId, quantity });
    return response.data;
};

/**
 * อัปเดตจำนวนสินค้าในตะกร้า (ส่งค่าจำนวนเต็มที่ต้องการ)
 * @param {string} productId - ไอดีสินค้า
 * @param {number} quantity - จำนวนใหม่
 */
export const updateCartQuantityApi = async (productId, quantity) => {
    const response = await apiClient.patch('/cart/update-quantity', { productId, quantity });
    return response.data;
};

/**
 * ลบสินค้าออกจากตะกร้า
 * @param {string} productId - ไอดีสินค้า
 */
export const removeFromCartApi = async (productId) => {
    const response = await apiClient.delete(`/cart/${productId}`);
    return response.data;
};

/**
 * ดึงข้อมูลสรุปยอดรวมตะกร้า
 */
export const getCartSummaryApi = async () => {
    const response = await apiClient.get('/cart/summary');
    return response.data;
};
