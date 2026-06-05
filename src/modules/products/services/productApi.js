import { apiClient } from '@/shared/api';

/**
 * 📦 User Product Service
 * ศูนย์รวมการดึงข้อมูลสินค้า หมวดหมู่ และแบรนด์ สำหรับหน้าบ้าน (User Side)
 * ดึงข้อมูลสดจาก Database เพื่อใช้ทำ Sidebar Filter และ Product Grid
 */

/**
 * ดึงรายการสินค้าทั้งหมดพร้อมระบบกรองขั้นสูง
 */
export const getProductsApi = async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
};

/**
 * ดึงรายการหมวดหมู่ (Categories) ทั้งหมดที่มีในระบบ
 */
export const getCategoriesApi = async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
};

/**
 * ดึงรายการแบรนด์ (Brands) ทั้งหมดที่มีในระบบ
 */
export const getBrandsApi = async (category) => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/products/brands', { params });
    return response.data;
};

/**
 * ดึงข้อมูลสินค้าชิ้นเดียวตาม ID
 * @param {string} id - ID ของสินค้า
 */
export const getProductByIdApi = async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};
