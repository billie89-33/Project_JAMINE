import apiClient from '@/shared/api/apiClient';

/**
 * 🔐 Auth API Service (Child)
 * จัดการ Endpoint เฉพาะของระบบยืนยันตัวตน
 */

// --- REAL API ENDPOINTS ---
/*
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
*/

// --- MOCK API (สำหรับทดสอบช่วงแรก) ---
// คัดลอกมาจากเวอร์ชันเดิมของคุณ เพื่อให้ใช้งาน admin/user ได้เหมือนเดิม

const mockUsers = [
  {
    id: "admin_1",
    email: "admin@example.com",
    password: "admin123",
    username: "Admin User",
    role: "admin",
  },
  {
    id: "user_1",
    email: "user@example.com",
    password: "user123",
    username: "Regular User",
    role: "user",
  },
];

export const loginApi = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email && u.password === password);
      if (user) {
        resolve({
          success: true,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: `mock-jwt-token-${Date.now()}`,
          },
        });
      } else {
        reject({
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    }, 500);
  });
};

export const registerApi = async (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = mockUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        reject({ success: false, message: "อีเมลนี้ลงทะเบียนแล้ว" });
      } else {
        resolve({
          success: true,
          message: "สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ",
          data: { ...userData, id: `user_${Date.now()}`, role: "user" },
        });
      }
    }, 500);
  });
};

export const getMeApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        resolve({ success: true, data: savedUser });
      } else {
        resolve({ success: false, message: "ไม่พบข้อมูลผู้ใช้" });
      }
    }, 300);
  });
};

export const logoutApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "ล็อกเอาต์สำเร็จ" });
    }, 300);
  });
};
