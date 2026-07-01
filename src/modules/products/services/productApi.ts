/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/shared/api';

/**
 * 📦 User Product Service
 * ศูนย์รวมการดึงข้อมูลสินค้า หมวดหมู่ และแบรนด์ สำหรับหน้าบ้าน (User Side)
 * ดึงข้อมูลสดจาก Database เพื่อใช้ทำ Sidebar Filter และ Product Grid
 */

/**
 * ดึงรายการสินค้าทั้งหมดพร้อมระบบกรองขั้นสูง
 */
export const getProductsApi = async (params: any): Promise<any> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
};

/**
 * ดึงรายการหมวดหมู่ (Categories) ทั้งหมดที่มีในระบบ
 */
export const getCategoriesApi = async (): Promise<any> => {
    const response = await apiClient.get('/products/categories');
    return response.data;
};

/**
 * ดึงรายการแบรนด์ (Brands) ทั้งหมดที่มีในระบบ
 */
export const getBrandsApi = async (category?: string): Promise<any> => {
    const params = category ? { category } : {};
    const response = await apiClient.get('/products/brands', { params });
    return response.data;
};

/**
 * ดึงโครงสร้างสเปคเดิมมาใช้ซ้ำ (Smart Spec Template)
 */
export const getSpecKeysApi = async (category: string): Promise<any> => {
    if (!category) return [];
    const response = await apiClient.get('/products/spec-keys', { params: { category } });
    return response.data;
};

/**
 * ดึงข้อมูลตัวเลือกสเปคสำหรับทำ Advance Filter
 */
export const getSpecFiltersApi = async (category: string): Promise<any> => {
    if (!category || category === 'All') return {};
    const response = await apiClient.get('/products/spec-filters', { params: { category } });
    return response.data;
};

/**
 * ดึงข้อมูลสินค้าชิ้นเดียวตาม ID
 * @param {string} id - ID ของสินค้า
 */
export const getProductByIdApi = async (id: string): Promise<any> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};

/**
 * ดึงรายการภาพปกหมวดหมู่ทั้งหมด (Public Category Covers)
 */
export const getCategoryCoversApi = async (): Promise<any> => {
    const response = await apiClient.get('/category-covers');
    return response.data;
};

