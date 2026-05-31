import { apiClient } from '@/shared/api';

/**
 * 🏠 Home API Service
 * ดึงข้อมูลแบนเนอร์และรายการพิเศษหน้าแรก
 */

/**
 * ดึงรายการแบนเนอร์ตามตำแหน่งแสดงผล
 * @param {string} placement - ตำแหน่ง (home_hero, category_hero, etc.)
 */
export const getBannersApi = async (placement) => {
    const response = await apiClient.get('/banners', { params: { placement } });
    return response.data;
};
