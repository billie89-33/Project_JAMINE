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
3.  **Global 401 Cleanup**: หากเซสชันหมดอายุ (401) ระบบส่วนกลางต้อง **ล้าง LocalStorage/SessionStorage ทันที** และดีดผู้ใช้ออกอัตโนมัติ

---

## 🛠️ 3. มาตรฐานการเขียนโค้ด (Production-Ready)

### 3.1 ตัวแม่ควบคุมเน็ตเวิร์ก (`src/shared/api/apiClient.js`)
เลเยอร์นี้ทำหน้าที่เป็นหัวใจหลัก จัดการเรื่อง Base URL และการดักจับข้อผิดพลาดทั่วทั้งแอป โดยออกแบบมาให้ **ยืดหยุ่น (Portable)** เพื่อนำไปใช้กับโปรเจกต์อื่นได้ง่าย

**กลยุทธ์การจัดการ Base URL:**
*   **Production/Staging:** ระบบจะดึงค่าจาก Environment Variable (`VITE_API_URL`) บน Server โดยอัตโนมัติ
*   **Development:** หากไม่มีการตั้งค่า .env ระบบจะถอยกลับไปใช้ **Fallback URL** (เช่น localhost) เพื่อให้ทีมพัฒนาเริ่มงานได้ทันทีโดยไม่ต้องตั้งค่าใหม่

```javascript
import axios from 'axios';

const apiClient = axios.create({
    // 💡 ยืดหยุ่น: ใช้ค่าจาก .env หรือ Fallback URL ตามสเปกของโปรเจกต์นั้นๆ
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
    
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, // ป้องกัน Request ค้างนานเกินไป
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        // ระบบ Cleanup อัตโนมัติเมื่อ Session หมดอายุ
        if (response && response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
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

## 🚀 6. Troubleshooting & Pro-Tips (Lessons Learned)

### 🍪 6.1 ปัญหา "หาคุกกี้ไม่เจอ" หรือ Login แล้วหลุด
*   **อาการ:** ยิง Login สำเร็จ แต่ Request ถัดไป (เช่น `/me`) แจ้งว่า 401 Unauthorized
*   **สาเหตุที่พบบ่อย:**
    1.  **LocalStorage Conflict:** ไปเขียนโค้ดเก็บ Token ลง LocalStorage เอง ทำให้ระบบงงและไม่ได้ใช้คุกกี้ HttpOnly
    2.  **Missing `withCredentials`:** ลืมตั้งค่า `withCredentials: true` ใน `apiClient.js`
    3.  **Base URL Mismatch:** Frontend ยิงไปหา Backend ผิด URL (เช่น ยิงไป Production แทน Localhost) ทำให้คุกกี้ไม่ถูกแชร์
*   **วิธีแก้:** ลบโค้ดจัดการ LocalStorage ออกให้หมด และเช็ค `baseURL` ใน `apiClient.js` ให้ตรงกับ Backend ที่รันอยู่จริง

### 🌐 6.2 การจัดการ Base URL ในเครื่อง (Localhost)
*   **มาตรฐาน:** Backend ปกติมักรันที่พอร์ต `4001` (หรือตามที่ระบุใน `API_SPEC.md`)
*   **Pro-Tip:** ใน `apiClient.js` ควรตั้ง Fallback URL ให้ตรงกับพอร์ตมาตรฐานของโปรเจกต์เสมอ เพื่อลดความยุ่งยากของเพื่อนร่วมทีม
    ```javascript
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1'
    ```

### 🛡️ 6.3 กฎเหล็กของ CORS (Backend Requirement)
เพื่อให้คุกกี้ HttpOnly ทำงานได้ Backend ต้องตั้งค่า CORS ดังนี้:
1.  `credentials: true`
2.  `origin: [Frontend_URL]` (ห้ามใช้ `*`)
3.  `methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']`

