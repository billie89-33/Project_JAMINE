/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/shared/api';

/**
 * 📦 Product Detail API Service
 * จัดการการดึงข้อมูลสินค้าเฉพาะชิ้นจาก Backend
 */

export const getProductByIdApi = async (productId: string): Promise<any> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
};
