# 🏗️ 01. Architecture & Directory Structure

เราใช้สถาปัตยกรรมแบบ **Modular Feature-driven (Enterprise Standard)** เพื่อให้โค้ดสะอาด มีความปลอดภัยสูงสุด และรองรับการสเกลระบบขนาดใหญ่

## 📂 Directory Structure
แบ่งแยกขาดจากกันระหว่าง **shared** (แกนกลาง) และ **modules** (กล่องฟีเจอร์)

### 1. `src/shared/` (The Kernel)
- `components/`: UI พื้นฐาน (Button, Input) และ **Shared Business Components** (เช่น OrderSummaryCard) ที่ต้องใช้งานร่วมกันในหลายโมดูล
- `api/`: Core API Client (ตัวแม่ คุม baseURL, Interceptors)
- `contexts/`: Global State ที่มีผลทั้งแอป (Auth, Theme)
- `providers/`: ตัวมัดรวม Provider (AppProvider.jsx)
- `hooks/` & `utils/`: ฟังก์ชันช่วยและ Custom Hooks ส่วนกลาง

### 2. `src/modules/` (Feature Modules)
แต่ละฟีเจอร์ต้องเป็นอิสระและมีโครงสร้างภายในที่ชัดเจน ตัวอย่างมาตรฐานที่เราใช้:

#### 📦 `modules/cart/` (Client-side Focused)
- **หน้าที่**: จัดการรายการสินค้าในตะกร้าเบื้องต้น (Client-side / LocalStorage / จัดการจำนวน)
- `hooks/useCart.js`: หัวใจสำคัญที่ทำหน้าที่ "แปลงข้อมูลตะกร้า" (Local) ส่งให้ Summary แสดงผล

#### 📦 `modules/checkout/` (Security & API Focused)
- **หน้าที่**: จัดการกระบวนการสั่งซื้อที่มีความปลอดภัยสูง (Address / Payment / Order Submission)
- `components/`: UI เฉพาะ เช่น `AddressSelector.jsx`, `PaymentMethodSelector.jsx`
- `hooks/useCheckout.js`: **หัวใจสำคัญ** ทำหน้าที่ดักจับ API, คำนวณค่าขนส่ง/ส่วนลดจริงจาก Server และส่งต่อให้ UI
- `services/checkoutApi.js`: ตัวยิง API เฉพาะของระบบสั่งซื้อ (เช่น `POST /orders`)
- `index.js`: **ประตูหลัก (Barrel File)** ทำหน้าที่ Re-export ทุกตัวรวมถึง Shared Components ออกไปให้หน้า Page ใช้งาน

...

### 3. `src/layouts/` & `src/pages/`
- **Layouts**: โครงร่างหน้า (MainLayout, AdminLayout)
- **Pages**: จุดรวมตัวของ Modules และ Layouts เพื่อสร้าง Route (ห้ามเขียน Logic ยาวเหยียดในนี้)

### 4. `vite.config.js` (The Navigator)
- **Path Aliasing**: ใช้ `@` เพื่อชี้ไปยังโฟลเดอร์ `src/` เสมอ เพื่อป้องกันปัญหา Path พังเมื่อมีการย้ายตำแหน่งไฟล์ (Relative Path Hell)
- **Alias Requirement**: ทุกการ Import ข้ามโฟลเดอร์หลัก (Modules -> Shared หรือ Pages -> Modules) ต้องใช้ `@/` นำหน้าเสมอ
