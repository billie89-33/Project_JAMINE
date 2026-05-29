import apiClient from '@/shared/api/apiClient';

/**
 * 🔐 Auth API Services
 * จัดการการเข้าสู่ระบบ, สมัครสมาชิก และดึงข้อมูลผู้ใช้
 * ใช้ระบบ HttpOnly Cookie ในการจัดการ Session (ไม่เก็บ Token ใน LocalStorage)
 */

// 1. เข้าสู่ระบบ (Login)
export const loginApi = async (email, password) => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
};

// 2. สมัครสมาชิก (Register)
export const registerApi = async (userData) => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
};

// 3. ออกจากระบบ (Logout)
export const logoutApi = async () => {
    const response = await apiClient.post('/users/logout');
    return response.data;
};

// 4. ดึงข้อมูลผู้ใช้ปัจจุบัน (Get Me)
export const getMeApi = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};
