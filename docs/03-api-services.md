# ⚛️ 03. API & Cookie Integration (Master Guide)

คู่มือสรุปแนวทางปฏิบัติในการเชื่อมต่อ Frontend (React) กับ Backend (Express) ผ่านระบบ **HTTP-Only Cookie** เพื่อความปลอดภัยสูงสุดและรองรับการรันบน Production (Render/Vercel)

---

## 📂 1. Centralized API Structure
เราจัดตั้งศูนย์กระจายสัญญาณการยิง API ไว้ที่ส่วนกลาง (`shared`) และกระจายบริการเฉพาะจุดไปยัง `services` ของแต่ละโมดูล

```text
src/
├── shared/
│   └── api/
│       └── apiClient.js      # 🌐 เลเยอร์ตัวแม่: คุม baseURL และ Cookie Config
│
└── modules/
    ├── auth/
    │   └── services/
    │       └── authApi.js    # 📦 เลเยอร์ตัวลูก: ยิงเฉพาะกิจระบบ Auth
    └── checkout/
        └── services/
            └── checkoutApi.js # 📦 เลเยอร์ตัวลูก: ยิงเฉพาะกิจระบบสั่งซื้อ
```

---

## 📜 2. 3 กฎเหล็กความปลอดภัย (Strict Rules)

1.  **`withCredentials: true`**: ต้องเปิด Option นี้ใน `apiClient.js` เสมอ เพื่อให้เบราว์เซอร์ยอมรับส่งคุกกี้ HttpOnly ข้ามโดเมน
2.  **No Token in LocalStorage**: ห้ามเก็บ Token ทุกชนิดลงใน Storage ฝั่งหน้าบ้าน (ป้องกัน XSS) ให้เหลือแค่หน้าที่เก็บข้อมูล User Profile ลงใน State เท่านั้น
3.  **Global 401 Interceptor**: หากเซสชันหมดอายุ (401) ระบบส่วนกลางต้องดีดผู้ใช้ออกอัตโนมัติ ไม่ต้องคอยเช็กเองทุกหน้า

---

## 🛠️ 3. มาตรฐานการเขียนโค้ด (Production-Ready)

### 3.1 ตัวแม่คุมเน็ตเวิร์ก (`src/shared/api/apiClient.js`)
```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // ⚠️ สำคัญมากสำหรับระบบคุกกี้
    headers: { 'Content-Type': 'application/json' },
});

// ระบบดักจับ Error ส่วนกลาง
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login'; // เซสชันหมดอายุ ดีดออกทันที
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

### 3.2 ตัวลูกบริการโมดูล (`src/modules/auth/services/authApi.js`)
เน้นตั้งชื่อที่สื่อความหมายและแยกงานออกจาก Business Logic ในหน้า UI
```javascript
import apiClient from '@/shared/api/apiClient';

export const loginApi = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};
```

---

## 🧠 4. การจัดการ Global Auth State
เราใช้ `AuthProvider` ร่วมกับ `useEffect` เพื่อตรวจสอบ "คุกกี้ใบเดิม" ทุกครั้งที่รีเฟรชหน้าจอ เพื่อป้องกันอาการล็อกอินหลุด

- **Check Session**: ใช้ฟังก์ชัน `getMe` เพื่อเช็กสถานะคุกกี้ตอน Component Mount
- **Loading State**: ต้องมีสถานะ `loading` ระหว่างเช็กคุกกี้ เพื่อไม่ให้หน้าเว็บวาร์ปหรือเห็นหน้าจอที่ควรถูกล็อก

---

## 🔒 5. Configuration (.env)
ใช้ `VITE_` นำหน้าเสมอเพื่อให้ Vite เข้าถึงตัวแปรได้
```env
VITE_API_URL=http://localhost:5000/api
```
