import { apiClient } from '@/shared/api';

/**
 * 📢 Advertising & Banner API Service
 * สำหรับจัดการ Banner ทั้งหมดในระบบ (Admin Only)
 */

/**
 * ดึงรายการ Banner ทั้งหมดสำหรับ Admin
 */
export const getAdminBannersApi = async () => {
    const response = await apiClient.get('/banners/admin');
    return response.data;
};

/**
 * สร้าง Banner ใหม่
 * @param {FormData} formData - ข้อมูล banner พร้อมไฟล์รูปภาพ
 */
export const createBannerApi = async (formData) => {
    const response = await apiClient.post('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * อัปเดตข้อมูล Banner
 * @param {string} id - ไอดี banner
 * @param {FormData} formData - ข้อมูลที่ต้องการแก้ไข
 */
export const updateBannerApi = async (id, formData) => {
    const response = await apiClient.patch(`/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * ลบ Banner ออกจากระบบ
 * @param {string} id - ไอดี banner
 */
export const deleteBannerApi = async (id) => {
    const response = await apiClient.delete(`/banners/${id}`);
    return response.data;
};
