# 🚀 08. Deployment & Production Best Practices

คู่มือแนวทางปฏิบัติในการนำระบบขึ้นสู่สภาวะจริง (Production) และการจัดการระบบ Cloud อย่างมืออาชีพ

---

## 🏗️ 1. Deployment Platforms

### 🔹 Backend Deployment (Render / Cloud PaaS)
การรัน Node.js API บนระบบ Cloud ต้องคำนึงถึงความยืดหยุ่นและความปลอดภัย:
*   **Dynamic Port Management:** ใช้ `process.env.PORT` เพื่อรองรับการสุ่มพอร์ตจากระบบ Cloud (ห้ามระบุพอร์ตตายตัว)
*   **Secure Environment Variables:** แยกข้อมูลสำคัญ (DB String, API Secrets) ออกจากโค้ดและตั้งค่าผ่าน Dashboard ของ Cloud Platform เท่านั้น
*   **Production Build Optimization:** ใช้คำสั่ง `npm ci --omit=dev` เพื่อติดตั้งเฉพาะไลบรารีที่จำเป็น ลดขนาดและเพิ่มความเร็วในการบิลด์

### 🔹 Frontend Deployment (Vercel / Netlify)
การรัน React/Vite สำหรับผู้ใช้งานจริง:
*   **Framework Preset Optimization:** ปรับแต่ง Build Settings ให้ตรงกับ Compiler ของโปรเจกต์ (เช่น Vite Preset)
*   **Dynamic Base URL:** ใช้ Environment Variables เพื่อให้หน้าบ้านชี้ไปยัง Production API ได้ถูกต้องตามสภาวะแวดล้อม
*   **Automated Redeployment:** ใช้ฟีเจอร์ Clear Cache เมื่อมีการอัปเดตโค้ดสำคัญ เพื่อป้องกันปัญหาข้อมูลค้างเก่า

---

## 🔌 2. API Integration & Architecture

### 🔄 Multi-Environment Support
การออกแบบระบบให้สามารถสลับโหมดระหว่าง **Development** และ **Production** ได้โดยไม่ต้องแก้ไขโค้ด:
*   ใช้ `baseURL` ที่มีระบบ Fallback (เช่น `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`)
*   บังคับใช้ `withCredentials: true` เสมอ เพื่อให้การรับส่ง Session/Cookie (JWT) ทำงานได้อย่างถูกต้องข้ามโดเมน

---

## 🔐 3. Security & Cloud Integration

### 🌐 CORS & Network Safety
*   **Backend CORS:** ตั้งค่า Middleware `cors()` ให้รองรับเฉพาะโดเมนของ Frontend ที่เชื่อถือได้
*   **Database Access:** ตั้งค่า Network Access / IP Whitelisting บน Cloud Database (เช่น MongoDB Atlas) เพื่อจำกัดสิทธิ์การเข้าถึงจากเซิร์ฟเวอร์ที่ได้รับอนุญาตเท่านั้น
*   **Third-Party Services:** เชื่อมต่อบริการภายนอก (Supabase, Firebase, Cloud Storage) ผ่าน SDK โดยใช้ Environment Variables ในการจัดเก็บ API Keys เสมอ

---
*อัปเกรดข้อมูลล่าสุดจากทักษะการ Deployment & API Integration - 2026-05-27*
