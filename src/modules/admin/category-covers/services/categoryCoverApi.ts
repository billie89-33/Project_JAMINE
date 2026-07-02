import { apiClient } from '@/shared/api';

/**
 * 🏷️ Admin Category Covers API Service
 * สำหรับจัดการภาพปกหมวดหมู่ (Admin Only)
 */

/**
 * ดึงรายการภาพปกหมวดหมู่ทั้งหมด
 */
export const getAdminCategoryCoversApi = async () => {
    const response = await apiClient.get('/admin/category-covers');
    return response.data;
};

/**
 * อัปโหลดหรืออัปเดตภาพปกหมวดหมู่
 * @param {string} categoryName - ชื่อหมวดหมู่ (เช่น Notebook, Keyboard)
 * @param {FormData} formData - ข้อมูลที่มีไฟล์รูปภาพ (image)
 */
export const upsertCategoryCoverApi = async (categoryName: string, formData: FormData) => {
    const response = await apiClient.put(`/admin/category-covers/${categoryName}`, formData);
    return response.data;
};
