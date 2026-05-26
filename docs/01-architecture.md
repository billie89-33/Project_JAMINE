# 🏗️ 01. Architecture & Directory Structure

เราใช้สถาปัตยกรรมแบบ **Modular Feature-driven (Enterprise Standard)** เพื่อให้โค้ดสะอาด มีความปลอดภัยสูงสุด และรองรับการสเกลระบบขนาดใหญ่

## 📂 Directory Structure
แบ่งแยกขาดจากกันระหว่าง **shared** (แกนกลาง) และ **modules** (กล่องฟีเจอร์)

### 1. `src/shared/` (The Kernel)
- `components/`: UI พื้นฐาน (Button, Input, Modal)
- `api/`: Core API Client (ตัวแม่ คุม baseURL, Interceptors)
- `contexts/`: Global State ที่มีผลทั้งแอป (Auth, Theme)
- `providers/`: ตัวมัดรวม Provider (AppProvider.jsx)
- `hooks/` & `utils/`: ฟังก์ชันช่วยและ Custom Hooks ส่วนกลาง

### 2. `src/modules/` (Feature Modules)
แต่ละฟีเจอร์ (เช่น auth, cart, products, product-detail) จะต้องเป็นอิสระและมีโครงสร้างภายในดังนี้:
- `components/`: UI เฉพาะของฟีเจอร์นั้น
- `hooks/`: Business Logic เฉพาะฟีเจอร์
- `services/`: API Service เฉพาะฟีเจอร์ (ตัวลูก)
- `contexts/`: State เฉพาะฟีเจอร์ (ถ้ามี)
- `index.js`: **ประตูเข้า-ออกหลัก (Barrel File)**

### 3. `src/layouts/` & `src/pages/`
- **Layouts**: โครงร่างหน้า (MainLayout, AdminLayout)
- **Pages**: จุดรวมตัวของ Modules และ Layouts เพื่อสร้าง Route (ห้ามเขียน Logic ยาวเหยียดในนี้)

### 4. `vite.config.js` (The Navigator)
- **Path Aliasing**: ใช้ `@` เพื่อชี้ไปยังโฟลเดอร์ `src/` เสมอ เพื่อป้องกันปัญหา Path พังเมื่อมีการย้ายตำแหน่งไฟล์ (Relative Path Hell)
- **Alias Requirement**: ทุกการ Import ข้ามโฟลเดอร์หลัก (Modules -> Shared หรือ Pages -> Modules) ต้องใช้ `@/` นำหน้าเสมอ
