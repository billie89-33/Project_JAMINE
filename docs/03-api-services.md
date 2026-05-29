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

## 🚀 6. มาตรฐานการพัฒนา (Updated Standards & Pro-Tips)

จากบทเรียนการพัฒนาล่าสุด เราได้สรุป 3 กฎเหล็กที่ต้องทำตามในทุกโปรเจกต์เพื่อลดความผิดพลาดและเพิ่มความปลอดภัยครับ:

### 🔐 6.1 มาตรฐานความปลอดภัย (Authentication & Cookie)
*   **No Token in LocalStorage:** ห้ามใช้ `localStorage.setItem('token', ...)` โดยเด็ดขาด เพราะเสี่ยงต่อการถูกขโมยผ่าน Script (XSS)
*   **HttpOnly Cookie:** ใช้คุกกี้ที่เซิร์ฟเวอร์ตั้งค่ามาให้เท่านั้น (HttpOnly) โดย Frontend ไม่ต้องเขียนโค้ดจัดการ Token เอง
*   **Mandatory `withCredentials`:** ใน `apiClient.js` ต้องตั้งค่า `withCredentials: true` เสมอ เพื่อให้เบราว์เซอร์ส่งคุกกี้กลับไปหาเซิร์ฟเวอร์ในทุก Request

### 🔄 6.2 มาตรฐานกระบวนการสั่งซื้อ (Checkout Flow Pattern)
เพื่อให้ข้อมูลมีความแม่นยำและป้องกันการข้ามขั้นตอน:
*   **Transactional Navigation:** เมื่อทำขั้นตอนหนึ่งเสร็จ (เช่น Checkout) ให้ใช้ `navigate('/target', { state: { ...data } })` เพื่อส่งข้อมูลไปยังหน้าถัดไป (เช่น ยอดเงิน, Order ID)
*   **Single Point of Truth:** หน้า Payment ควรรับยอดเงินจาก `location.state` ที่ส่งมาจากหน้า Checkout เท่านั้น เพื่อป้องกันไม่ให้ผู้ใช้แก้ไขยอดเงินเองในตะกร้าหลังจากสร้างออเดอร์แล้ว

### 💳 6.3 มาตรฐานระบบชำระเงิน (Payment & Dynamic QR)
*   **Dynamic Data:** หน้าชำระเงินต้องรองรับการแสดงผลตามข้อมูลจริงที่ได้รับมา (Total Amount, Order ID)
*   **Functional QR Generation:** การใช้ Library เช่น `promptpay-qr` ต้องใช้หมายเลข PromptPay (เบอร์โทร/เลขผู้เสียภาษี) ที่ถูกต้องเท่านั้นเพื่อให้แอปธนาคารสแกนได้จริง
*   **Import Strategy:** หากหน้าเว็บเกิด Error #130 ให้เปลี่ยนจากการ Import ผ่าน Barrel File (`index.js`) มาเป็นการ **Import ตรงจากไฟล์ Component** เพื่อป้องกันปัญหา Circular Dependency และค่าที่เป็น `undefined`

### 🌐 6.4 การจัดการ Base URL และสภาพแวดล้อม
*   **Localhost Standard:** ตั้งค่า Fallback URL ให้ตรงกับ Backend ในเครื่องเสมอ (เช่น พอร์ต 4001)
*   **Environment Check:** ก่อน Deploy ต้องเช็คไฟล์ `.env` ว่า `VITE_API_URL` ถูกต้องตาม Server จริงหรือไม่

