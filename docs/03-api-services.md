# 🧪 03. API & Cookie Integration (Master Guide)

คู่มือสรุปแนวทางปฏิบัติในการเชื่อมต่อ Frontend (React) กับ Backend (Express) ผ่านระบบ **HTTP-Only Cookie** เพื่อความปลอดภัยสูงสุดและรองรับการรันบน Production (Render/Vercel)

---

## 📂 1. Centralized API Structure
เราจัดตั้งศูนย์กระจายสัญญาณการยิง API ไว้ที่ส่วนกลาง (`shared`) และกระจายบริการเฉพาะจุดไปยัง `services` ของแต่ละโมดูล

### โครงสร้างไฟล์:
- `src/shared/api/apiClient.js`: ตั้งค่า Axios Instance (Base URL, Timeout, Credentials)
- `src/modules/*/services/`: ไฟล์ API เฉพาะของโมดูลนั้นๆ (เช่น `authApi.js`, `productApi.js`)

---

## 🛡️ 2. Security & Credentials
เพื่อให้ระบบปลอดภัยจากการแฮกข้อมูล (XSS) เราห้ามเก็บ Token ไว้ใน LocalStorage เด็ดขาด

### กฎทอง (Strict Rules):
1.  **With Credentials:** ทุก Request ต้องตั้งค่า `withCredentials: true` เพื่อให้บราวเซอร์ส่ง Cookie ไปหา Backend อัตโนมัติ
2.  **No Manual Headers:** ห้ามตั้งค่า `Authorization: Bearer ...` ที่หน้าบ้านเองเด็ดขาด ปล่อยให้ Backend เป็นคนจัดการผ่าน Set-Cookie Header
3.  **Automatic CSRF:** ระบบจะถูกปกป้องอัตโนมัติหากใช้ SameSite: None และ Secure ในฝั่ง Backend

---

## ⚙️ 3. Axios Interceptors (The Shield)
เราใช้ Interceptors เพื่อจัดการ Error และสถานะเครื่องแม่ข่ายในจุดเดียว

- **Request Interceptor:** ใช้สำหรับวัดความเร็ว API หรือแนบข้อมูลส่วนกลาง
- **Response Interceptor:** 
    - หากเจอ Error **401 (Unauthorized)** ให้สั่ง Logout ผู้ใช้อัตโนมัติและเคลียร์ State
    - หากเจอ Error **500** ให้แสดงข้อความแจ้งเตือนผู้ใช้ (Toast)

---

## 🎯 สรุปคุณค่าของ API Patterns เหล่านี้:
1. **ความเสถียร (Stability):** ระบบจะไม่ล่มเมื่อเน็ตหลุด หรือ API พลาด เพราะมีระบบจัดการ Error และ Retry ที่ดี
2. **ความปลอดภัย (Security):** ข้อมูลส่วนตัวไม่หลุด เพราะใช้ HttpOnly Cookies และ Interceptors
3. **ประสิทธิภาพ (Performance):** ประหยัดแบนด์วิดท์ และลดอาการกระตุกของหน้าเว็บด้วยระบบ Debounce และ Surgical Update (PATCH)

---
*หมายเหตุ: คู่มือนี้คือมาตรฐานสูงสุดของ Jamine Project ห้ามละเมิดกฎการใช้ HttpOnly และ Interceptors โดยเด็ดขาด*
