# ⚛️ React Frontend API & Cookie Integration Best Practices

คู่มือสรุปแนวทางปฏิบัติที่ดีที่สุดฝั่ง Frontend (React) ในการเชื่อมต่อกับหลังบ้าน (Express API) ผ่านระบบรักษาความปลอดภัยแบบ **HTTP-Only Cookie** เพื่อให้รับส่งสถานะล็อกอินระหว่างเครื่องคอมพิวเตอร์ของคุณและเซิร์ฟเวอร์ Render ได้อย่างสมบูรณ์ ปลอดภัย และไร้ปัญหา CORS

---

## 📂 1. โครงสร้างการจัดวางเลเยอร์ API (Centralized Services)
ตามหลัก **Modular Architecture** เราจะจัดตั้งศูนย์กระจายสัญญาณการยิง API ตัวแม่ไว้ที่ส่วนกลาง (`shared`) แล้วให้ไฟล์บริการตัวลูก (`services`) ในแต่ละโมดูลดึงไปใช้งาน เพื่อความสะอาดและไม่เขียนโค้ดซ้ำซาก

```text
src/
├── shared/
│   └── api/
│       └── apiClient.js      # 🌐 เลเยอร์ตัวแม่: ตั้งค่า Axios Core (คุม baseURL / คุกกี้ส่วนกลาง)
│
└── modules/
    ├── auth/
    │   └── services/
    │       └── authApi.js    # 📦 เลเยอร์ตัวลูก: ยิงเฉพาะกิจของระบบ Auth (Login / Logout)
    └── checkout/
        └── services/
            └── checkoutApi.js # 📦 เลเยอร์ตัวลูก: ยิงเฉพาะกิจของระบบสั่งซื้อ (Create Order)
```

---

## 📜 2. 3 กฎเหล็กฝั่งหน้าบ้าน (Strict Frontend API Rules)

1.  **`withCredentials: true` (กฎการเปิดสิทธิ์คุกกี้):** ทุกการส่ง Request ผ่าน Axios หรือ Fetch ไปหาหลังบ้าน **จำเป็นต้องแนบ Option นี้เสมอ** เพื่อให้เบราว์เซอร์ยอมเก็บคุกกี้ลงเครื่อง และยอมส่งคุกกี้ใบนี้กลับไปให้หลังบ้านตรวจสอบในครั้งถัดไป
2.  **ห้ามเก็บ Token ลงใน LocalStorage:** เนื่องจากเราย้ายไปใช้ระบบ HTTP-Only Cookie แล้ว หน้าบ้านจะเหลือหน้าที่แค่เก็บ "ข้อมูลโปรไฟล์ผู้ใช้ (User Profile Data)" ลงใน State เท่านั้น ห้ามนำคีย์ Token ใด ๆ ไปเซฟลง `localStorage` เพื่อตัดช่องโหว่การโดนขโมยผ่านการโจมตี XSS
3.  **ดักจับ Error 401 ที่จุดศูนย์กลาง (Global Interceptor):** หากเซสชันหมดอายุ หลังบ้านจะตีกลับด้วยรหัส `401 Unauthorized` หน้าบ้านต้องมีตัวดักจับตรงกลางเพื่อสลัดผู้ใช้ออกจากระบบอัตโนมัติ ไม่ต้องคอยเขียนดัก `try-catch` เองในทุกหน้าจอ

---

## 🛠️ 3. โค้ดต้นแบบการตั้งค่าเลเยอร์ API (Production-Ready)

### 3.1 ตัวแม่คุมเน็ตเวิร์กส่วนกลาง (`src/shared/api/apiClient.js`)
ทำหน้าที่เชื่อมต่อกับฐานเซิร์ฟเวอร์ Render ปลดล็อกระบบรักษาความปลอดภัยคุกกี้ และทำความสะอาดข้อมูล Error ส่งต่อให้หน้าจอแสดงผลได้สวยงาม

```javascript
import axios from 'axios';

const apiClient = axios.create({
    // ดึงค่า URL ของ Render จากไฟล์ .env (ถ้าไม่มีให้ถอยมารัน localhost)
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // ⚠️ กฎข้อที่ 1: บังคับรับส่งคุกกี้ HttpOnly ข้ามโดเมน
    headers: {
        'Content-Type': 'application/json',
    },
});

// ระบบ Interceptor สำหรับดักจับการตอบกลับจากเซิร์ฟเวอร์ทั่วทั้งแอปพลิเคชัน
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // หากหลังบ้านส่ง 401 กลับมา แปลว่าคุกกี้หมดอายุ หรือผู้ใช้พยายามแอบเข้าหน้าอื่น
        if (error.response && error.response.status === 401) {
            // สั่งล้างหน้าจอ ล้างสเตตส์ และพายูสเซอร์กลับไปหน้า Login ทันที
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

### 3.2 ตัวลูกบริการประจำโมดูลย่อย (`src/modules/auth/services/authApi.js`)
ดึงความสามารถจากตัวแม่มายิง Endpoint เฉพาะตัว ช่วยให้โค้ดสั้นและค้นหาไฟล์ซ่อมบำรุงในอนาคตได้ง่าย

```javascript
import apiClient from '@/shared/api/apiClient';

// ฟังก์ชันยิงเข้าระบบล็อกอิน
export const loginRequest = async (email, password) => {
    // ส่งข้อมูลไปตรวจสอบ หลังบ้านจะตอบกลับข้อมูลผู้ใช้ ส่วนคุกกี้เบราว์เซอร์จะเก็บให้เองอัตโนมัติ
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

// ฟังก์ชันยิงขอล้างคุกกี้ออกจากเบราว์เซอร์
export const logoutRequest = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
};

// ฟังก์ชันยิงดึงข้อมูลผู้ใช้ปัจจุบัน (ใช้ตอนเปิดเว็บหรือกดรีเฟรชหน้าจอ)
export const getMeRequest = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};
```

---

## 🧠 4. เลเยอร์จัดการ Global State ร่วมกับคุกกี้ (`src/shared/contexts/AuthContext.jsx`)
ตัวจัดการสถานะกลางที่จะคอยรันตรวจสอบระบบทุกครั้งที่ผู้ใช้เปิดหน้าเว็บ เพื่อเช็กว่าคุกกี้ค้างเครื่องยังมีอายุใช้งานได้อยู่จริงไหม ช่วยป้องกันอาการหลุดล็อกอินเวลาเปิดแท็บใหม่

```jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { loginRequest, logoutRequest, getMeRequest } from '@/modules/auth/services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // คอยดักไม่ให้หน้าเว็บวาร์ปช่วงที่เช็กสิทธิ์คุกกี้

    // 🕵️‍♂️ ตรวจเช็กคุกกี้ทันทีที่เปิดเว็บครั้งแรก
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await getMeRequest();
                if (res.success) {
                    setUser(res.data); // คุกกี้ยังใช้งานได้ ยัดข้อมูลผู้ใช้เข้า State
                }
            } catch (error) {
                setUser(null); // ไม่มีคุกกี้ หรือคุกกี้พัง ปรับสถานะเป็นไม่ได้เข้าสู่ระบบ
            } finally {
                setLoading(false); // เช็กเสร็จสิ้น ปิดสถานะโหลด
            }
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await loginRequest(email, password);
            if (res.success) {
                setUser(res.data);
                return { success: true };
            }
        } catch (error) {
            setUser(null);
            // แกะข้อความแจ้งเตือนที่ขัดเกลามาจาก errorHandler ของฝั่งหลังบ้าน
            const message = error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutRequest();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null); // เคลียร์ความจำฝั่งหน้าบ้านทิ้งทั้งหมด
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
```

---

## 🔒 5. การใช้ตัวแปลสภาวะแวดล้อมฝั่งหน้าบ้าน (.env)

เพื่อความยืดหยุ่นในการเขียนโค้ดและนำขึ้นระบบจริง ให้สร้างไฟล์ชื่อ **`.env`** ไว้ที่โฟลเดอร์นอกสุดของฝั่ง Frontend (สำหรับ Vite จะใช้คำนำหน้าว่า `VITE_`)

```env
# 💻 ตอนรันเครื่องตัวเอง (Development Stage)
VITE_API_URL=http://localhost:5000/api

# 🚀 ตอนขึ้นเว็บจริง (Production Stage บน Render/Vercel)
# VITE_API_URL=https://your-backend-on-render.com