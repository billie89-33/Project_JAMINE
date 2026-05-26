import apiClient from '@/shared/api/apiClient';

/**
 * 🔐 Auth API Service (Child)
 * จัดการ Endpoint เฉพาะของระบบยืนยันตัวตน
 */

// --- REAL API ENDPOINTS ---

export const loginApi = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

export const registerApi = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};

export const logoutApi = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
};

export const getMeApi = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

// --- MOCK API (สำหรับทดสอบช่วงแรก) ---
// คุณสามารถสลับใช้ Mock ได้หาก Backend ยังไม่พร้อม
/*
export const loginApi = async (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, data: { email, role: 'admin' } }), 500);
    });
};
*/
