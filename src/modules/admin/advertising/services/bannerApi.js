import { apiClient } from '@/shared/api';

/**
 * 📢 Advertising & Banner API Service
 * สำหรับจัดการ Banner ทั้งหมดในระบบ (Admin Only)
 */

/**
 * ดึงรายการ Banner ทั้งหมดสำหรับ Admin
 */
export const getAdminBannersApi = async () => {
    // 🛡️ ตาม Spec v2: GET /admin/banners
    const response = await apiClient.get('/admin/banners');
    return response.data;
};

/**
 * สร้าง Banner ใหม่
 * @param {FormData} formData - ข้อมูล banner พร้อมไฟล์รูปภาพ
 */
export const createBannerApi = async (formData) => {
    // 🛡️ ตาม Spec v2: POST /admin/banners (ปล่อยให้ Axios จัดการ Boundary อัตโนมัติ)
    const response = await apiClient.post('/admin/banners', formData);
    return response.data;
};

/**
 * อัปเดตข้อมูล Banner
 * @param {string} id - ไอดี banner
 * @param {FormData} formData - ข้อมูลที่ต้องการแก้ไข
 */
export const updateBannerApi = async (id, formData) => {
    // 🛡️ ตาม Spec v2: PATCH /admin/banners/:id
    const response = await apiClient.patch(`/admin/banners/${id}`, formData);
    return response.data;
};

/**
 * ลบ Banner ออกจากระบบ
 * @param {string} id - ไอดี banner
 */
export const deleteBannerApi = async (id) => {
    // 🛡️ ตาม Spec v2: DELETE /admin/banners/:id
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return response.data;
};
