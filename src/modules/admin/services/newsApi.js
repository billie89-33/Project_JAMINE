import apiClient from '@/shared/api/apiClient';

/**
 * 📰 Admin News & Category Services
 * รวม API สำหรับจัดการข่าวสารและหมวดหมู่ข่าว
 */

// --- 1. News API ---

// ดึงรายการข่าวทั้งหมด (รองรับ pagination, category, isPublished)
export const getNewsApi = async (params = {}) => {
    const response = await apiClient.get('/news', { params });
    return response.data;
};

// ดึงรายละเอียดข่าวรายชิ้น
export const getNewsByIdApi = async (id) => {
    const response = await apiClient.get(`/news/${id}`);
    return response.data;
};

// สร้างข่าวใหม่ (Admin)
export const createNewsApi = async (data) => {
    const response = await apiClient.post('/news/admin', data);
    return response.data;
};

// แก้ไขข่าว (Admin)
export const updateNewsApi = async (id, data) => {
    const response = await apiClient.patch(`/news/admin/${id}`, data);
    return response.data;
};

// ลบข่าว (Admin)
export const deleteNewsApi = async (id) => {
    const response = await apiClient.delete(`/news/admin/${id}`);
    return response.data;
};

// --- 2. News Category API ---

// ดึงหมวดหมู่ข่าวทั้งหมด
export const getNewsCategoriesApi = async () => {
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
