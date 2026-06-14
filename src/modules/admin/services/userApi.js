import apiClient from '@/shared/api/apiClient';

/**
 * 👨‍👩‍👧‍👦 Admin User/Customer Services
 * รวม API สำหรับจัดการลูกค้าในฝั่ง Admin
 */

// 1. ดึงรายชื่อลูกค้าพร้อม Pagination และ Search
export const getUsersApi = async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
};

// 2. ดึงข้อมูลสรุปของลูกค้า (Profile + Stats)
export const getUserSummaryApi = async (id) => {
    const response = await apiClient.get(`/admin/users/${id}/summary`);
    return response.data;
};

// 3. อัปเดตสถานะลูกค้า (Active / Banned)
export const updateUserStatusApi = async (id, status) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data;
};

// 4. ลบข้อมูลลูกค้า
export const deleteUserApi = async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
};
