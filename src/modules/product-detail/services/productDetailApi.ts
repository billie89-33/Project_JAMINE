import { apiClient } from '@/shared/api';
import { ApiResponse, Product } from '@/types';

/**
 * 📦 Product Detail API Service
 * จัดการการดึงข้อมูลสินค้าเฉพาะชิ้นจาก Backend
 */

export const getProductByIdApi = async (productId: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
};
