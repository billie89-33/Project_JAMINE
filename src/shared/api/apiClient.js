import axios from 'axios';

/**
 * 🌐 Core API Client (Mother)
 * จัดการเรื่องความปลอดภัย, Base URL และ Interceptors ที่จุดเดียว
 */
const apiClient = axios.create({
    // ดึงค่าจาก .env หรือใช้ localhost เป็นค่าเริ่มต้น
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // ⚠️ สำคัญ: เพื่อให้เบราว์เซอร์รับ-ส่งคุกกี้ HttpOnly กับ Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Interceptors (ระบบดักจับ) ---

// 1. Request Interceptor: เช่น การแนบ Token (หากไม่ได้ใช้ HttpOnly Cookie)
apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: เช่น การจัดการ Error 401 (Unauthorized) ทั่วแอป
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // หากเซิร์ฟเวอร์ตอบกลับ 401 (เช่น Token หมดอายุ) ให้เด้งไปหน้า Login
        if (error.response && error.response.status === 401) {
            // window.location.href = '/login';
            console.warn('Session expired or Unauthorized. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
