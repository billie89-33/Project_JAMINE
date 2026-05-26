# 🔌 03. API & Service Management

การจัดการ API แบบลูก-แม่ เพื่อความปลอดภัยและการบำรุงรักษาที่ง่าย

## 🛠️ ตัวแม่: `src/shared/api/apiClient.js`
ทำหน้าที่ควบคุมโครงสร้างหลัก:
- `baseURL`: ดึงจาก `import.meta.env.VITE_API_URL`
- `withCredentials: true`: เพื่อรองรับ HttpOnly Cookies (สำคัญมากสำหรับการทำ Auth)
- `Interceptors`: ดักจับ Error 401 เพื่อสั่ง Logout อัตโนมัติ

## 🛠️ ตัวลูก: `src/modules/[feature]/services/[name]Api.js`
ทำหน้าที่เรียกใช้ `apiClient` และระบุ Endpoint เฉพาะ:
```javascript
import apiClient from '@/shared/api/apiClient';

export const getItems = async () => {
    const response = await apiClient.get('/items');
    return response.data;
};
```

## ✅ แนวทางปฏิบัติ
- ห้ามใช้ `axios` หรือ `fetch` ตรงๆ ใน Component
- ทุก API Call ต้องผ่าน Service Layer เสมอ
- จัดการ Error ใน Service หรือใช้ Interceptor ส่วนกลาง
