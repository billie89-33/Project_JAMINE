import { apiClient } from '@/shared/api';
import { ApiResponse, User } from '@/types';

/**
 * 👨‍👩‍👧‍👦 Admin User/Customer Services
 * รวม API สำหรับจัดการลูกค้าในฝั่ง Admin
 */

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    keyword?: string;
    status?: string;
    role?: string;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
}

export interface UserSummary {
    user?: User;
    profile?: User;
    orderSummary?: any;
    stats?: {
        totalOrders: number;
        totalSpent: number;
        lastLogin?: string;
    };
}

// 1. ดึงรายชื่อลูกค้าพร้อม Pagination และ Search
export const getUsersApi = async (params: GetUsersParams = {}): Promise<ApiResponse<PaginatedUsers>> => {
    const response = await apiClient.get<ApiResponse<PaginatedUsers>>('/admin/users', { params });
    return response.data;
};

// 2. ดึงข้อมูลสรุปของลูกค้า (Profile + Stats)
export const getUserSummaryApi = async (id: string): Promise<ApiResponse<UserSummary>> => {
    const response = await apiClient.get<ApiResponse<UserSummary>>(`/admin/users/${id}/summary`);
    return response.data;
};

// 3. แก้ไขข้อมูลลูกค้าโดย Admin (Full Edit: Name, Email, Phone, Status)
export const updateUserByAdminApi = async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, data);
    return response.data;
};

// 4. ส่งออกข้อมูลลูกค้า
export const exportCustomersApi = async (params: GetUsersParams = {}): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>('/admin/users/export', { params });
    return response.data;
};

// 5. ลบข้อมูลลูกค้า
export const deleteUserApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ id: string }>>(`/admin/users/${id}`);
    return response.data;
};
