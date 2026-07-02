import { apiClient } from '@/shared/api';
import { ApiResponse, News } from '@/types';

/**
 * 📰 Admin News & Category Services
 * รวม API สำหรับจัดการข่าวสารและหมวดหมู่ข่าว
 * Fix: Sync endpoints with backend v1.3 structure & fix 404
 */

export interface GetNewsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isPublished?: boolean;
}

export interface PaginatedNews {
    news: News[];
    total: number;
    page: number;
    totalPages: number;
}

export interface NewsCategory {
    _id: string;
    name: string;
    description?: string;
    isActive?: boolean;
}

export interface UploadImageResponse {
    url: string;
}

// --- 1. News API ---

// ดึงรายการข่าวทั้งหมด (Admin) - ใช้เส้นทาง /admin/news
export const getNewsApi = async (params: GetNewsParams = {}): Promise<ApiResponse<PaginatedNews>> => {
    const response = await apiClient.get<ApiResponse<PaginatedNews>>('/admin/news', { params });
    return response.data;
};

// ดึงรายการข่าวสำหรับหน้าบ้าน (Public) - ใช้เส้นทาง /news
export const getPublicNewsApi = async (params: GetNewsParams = {}): Promise<ApiResponse<PaginatedNews>> => {
    const response = await apiClient.get<ApiResponse<PaginatedNews>>('/news', { params });
    return response.data;
};

// ดึงรายละเอียดข่าวรายชิ้น (Public)
export const getNewsByIdApi = async (id: string): Promise<ApiResponse<News>> => {
    const response = await apiClient.get<ApiResponse<News>>(`/news/${id}`);
    return response.data;
};

// สร้างข่าวใหม่ (Admin)
export const createNewsApi = async (data: Partial<News> | FormData): Promise<ApiResponse<News>> => {
    const response = await apiClient.post<ApiResponse<News>>('/admin/news', data);
    return response.data;
};

// แก้ไขข่าว (Admin)
export const updateNewsApi = async (id: string, data: Partial<News> | FormData): Promise<ApiResponse<News>> => {
    const response = await apiClient.patch<ApiResponse<News>>(`/admin/news/${id}`, data);
    return response.data;
};

// ลบข่าว (Admin)
export const deleteNewsApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/news/${id}`);
    return response.data;
};

// อัปโหลดรูปภาพแทรกในเนื้อหาข่าว (Returns URL)
export const uploadNewsImageApi = async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const data = new FormData();
    data.append('image', file);
    const response = await apiClient.post<ApiResponse<UploadImageResponse>>('/admin/news/upload-image', data);
    return response.data; // { success: true, url: '...' }
};

// --- 2. News Category API ---

// ดึงหมวดหมู่ข่าวทั้งหมด (Admin)
export const getNewsCategoriesApi = async (): Promise<ApiResponse<NewsCategory[]>> => {
    const response = await apiClient.get<ApiResponse<NewsCategory[]>>('/admin/news-categories');
    return response.data;
};

// ดึงหมวดหมู่ข่าวสำหรับหน้าบ้าน (Public)
export const getPublicNewsCategoriesApi = async (): Promise<ApiResponse<NewsCategory[]>> => {
    const response = await apiClient.get<ApiResponse<NewsCategory[]>>('/news-categories');
    return response.data;
};

// สร้างหมวดหมู่ข่าว (Admin)
export const createNewsCategoryApi = async (data: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> => {
    const response = await apiClient.post<ApiResponse<NewsCategory>>('/admin/news-categories', data);
    return response.data;
};

// แก้ไขหมวดหมู่ข่าว (Admin)
export const updateNewsCategoryApi = async (id: string, data: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> => {
    const response = await apiClient.patch<ApiResponse<NewsCategory>>(`/admin/news-categories/${id}`, data);
    return response.data;
};

// ลบหมวดหมู่ข่าว (Admin)
export const deleteNewsCategoryApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/news-categories/${id}`);
    return response.data;
};
