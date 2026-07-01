import apiClient from '@/shared/api/apiClient';
import { ApiResponse, Order, User, ChangePasswordPayload } from '@/types';

/**
 * 👤 User Profile API Service
 * จัดการข้อมูลส่วนตัวและประวัติการสั่งซื้อ
 */

// 1. ดึงรายการคำสั่งซื้อของ User
export const getMyOrdersApi = async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/me');
    // Backend ส่งมาเป็น { success: true, data: [...] }
    return response.data.data;
};

// 2. อัปเดตข้อมูล Profile (เช่น ชื่อ)
export const updateProfileApi = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch('/users/profile', userData);
    return response.data;
};

// 3. เปลี่ยนรหัสผ่าน
export const changePasswordApi = async (passwordData: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch('/users/change-password', passwordData);
    return response.data;
};
