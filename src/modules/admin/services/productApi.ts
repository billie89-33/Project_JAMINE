import { apiClient } from '@/shared/api';
import { ApiResponse, Product } from '@/types';

/**
 * 🛠️ Admin Product Mother Service
 * ศูนย์รวมคำสั่งจัดการข้อมูลสินค้าทั้งหมดจากฝั่ง Admin
 * รองรับการ สร้าง, อ่าน, แก้ไข, และลบ (CRUD)
 */

export interface GetAdminProductsParams {
    category?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * ดึงรายการสินค้าทั้งหมดพร้อมรองรับการกรอง (Filtering & Pagination)
 * @param {GetAdminProductsParams} params - Query parameters เช่น category, page, limit, keyword, status
 */
export const getAdminProducts = async (params?: GetAdminProductsParams): Promise<ApiResponse<PaginatedProducts>> => {
    const response = await apiClient.get<ApiResponse<PaginatedProducts>>('/admin/products', { params });
    return response.data;
};

/**
 * ดึงรายละเอียดสินค้าทีละชิ้นตาม ID (สำหรับหน้าแก้ไข)
 * @param {string} id - ID ของสินค้า
 */
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
};

/**
 * สร้างสินค้าใหม่ (รองรับ FormData สำหรับไฟล์รูปภาพ)
 * @param {FormData} formData - ข้อมูลสินค้าพร้อมไฟล์ภาพ
 */
export const createProductApi = async (formData: FormData): Promise<ApiResponse<Product>> => {
    // 🛡️ ปล่อยให้ Axios จัดการ Boundary อัตโนมัติ (ห้ามเซ็ต Header เอง)
    const response = await apiClient.post<ApiResponse<Product>>('/admin/products', formData);
    return response.data;
};

/**
 * สร้างสินค้าใหม่ (แบบ JSON ปกติ - เก็บไว้เป็นทางเลือก)
 * @param {Partial<Product>} productData - ข้อมูลสินค้าตาม Product Model
 */
export const createProduct = async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post<ApiResponse<Product>>('/admin/products', productData);
    return response.data;
};

/**
 * แก้ไขข้อมูลสินค้าเดิม (Surgical Update)
 * @param {string} id - ID ของสินค้าที่ต้องการแก้ไข
 * @param {Partial<Product> | FormData} productData - ข้อมูลที่ต้องการอัปเดต
 */
export const updateProduct = async (id: string, productData: Partial<Product> | FormData): Promise<ApiResponse<Product>> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/admin/products/${id}`, productData);
    return response.data;
};

/**
 * ลบสินค้าออกจากระบบ
 * @param {string} id - ID ของสินค้าที่ต้องการลบ
 */
export const deleteProduct = async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/products/${id}`);
    return response.data;
};
