import apiClient from '@/shared/api/apiClient';

/**
 * 📰 Admin News & Category Services
 * รวม API สำหรับจัดการข่าวสารและหมวดหมู่ข่าว
 * Fix: Sync endpoints with backend v1.3 structure & fix 404
 */

// --- 1. News API ---

// ดึงรายการข่าวทั้งหมด (Admin) - ใช้เส้นทาง /admin/news
export const getNewsApi = async (params = {}) => {
    const response = await apiClient.get('/admin/news', { params });
    return response.data;
};

// ดึงรายการข่าวสำหรับหน้าบ้าน (Public) - ใช้เส้นทาง /news
export const getPublicNewsApi = async (params = {}) => {
    const response = await apiClient.get('/news', { params });
    return response.data;
};

// ดึงรายละเอียดข่าวรายชิ้น (Public)
export const getNewsByIdApi = async (id) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
};

// สร้างข่าวใหม่ (Admin)
export const createNewsApi = async (data) => {
    const response = await apiClient.post('/admin/news', data);
    return response.data;
};

// แก้ไขข่าว (Admin)
export const updateNewsApi = async (id, data) => {
    const response = await apiClient.patch(`/admin/news/${id}`, data);
    return response.data;
};

// ลบข่าว (Admin)
export const deleteNewsApi = async (id) => {
    const response = await apiClient.delete(`/admin/news/${id}`);
    return response.data;
};

// --- 2. News Category API ---

// ดึงหมวดหมู่ข่าวทั้งหมด (Admin)
export const getNewsCategoriesApi = async () => {
    const response = await apiClient.get('/admin/news-categories');
    return response.data;
};

// ดึงหมวดหมู่ข่าวสำหรับหน้าบ้าน (Public)
export const getPublicNewsCategoriesApi = async () => {
    const response = await apiClient.get('/news-categories');
    return response.data;
};

// สร้างหมวดหมู่ข่าว (Admin)
export const createNewsCategoryApi = async (data) => {
    const response = await apiClient.post('/admin/news-categories', data);
    return response.data;
};

// แก้ไขหมวดหมู่ข่าว (Admin)
export const updateNewsCategoryApi = async (id, data) => {
    const response = await apiClient.patch(`/admin/news-categories/${id}`, data);
    return response.data;
};

// ลบหมวดหมู่ข่าว (Admin)
export const deleteNewsCategoryApi = async (id) => {
    const response = await apiClient.delete(`/admin/news-categories/${id}`);
    return response.data;
};
