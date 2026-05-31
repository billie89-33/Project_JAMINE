import { apiClient } from '@/shared/api';

/**
 * 📦 Product Detail API Service
 * จัดการการดึงข้อมูลสินค้าเฉพาะชิ้นจาก Backend
 */

export const getProductByIdApi = async (productId) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
};
