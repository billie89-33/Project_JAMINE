# 🏗️ 01. Architecture & Directory Structure

เราใช้สถาปัตยกรรมแบบ **Modular Feature-driven (Enterprise Standard)** เพื่อให้โค้ดสะอาด มีความปลอดภัยสูงสุด และรองรับการสเกลระบบขนาดใหญ่

## 📂 Directory Structure
แบ่งแยกขาดจากกันระหว่าง **shared** (แกนกลาง) และ **modules** (กล่องฟีเจอร์)

### 1. `src/shared/` (The Kernel)
- `components/`: UI พื้นฐาน (Button, Input) และ **Shared Business Components** (เช่น OrderSummaryCard) ที่ต้องใช้งานร่วมกันในหลายโมดูล
- `api/`: Core API Client (ตัวแม่ คุม baseURL, Interceptors)
- `contexts/`: Global State ที่มีผลทั้งแอป (Auth, Theme)
- `providers/`: ตัวมัดรวม Provider (AppProvider.jsx)
- `hooks/`: **Global/Utility Hooks** ที่ใช้งานข้ามโมดูลหรือจัดการระดับแอปพลิเคชัน (เช่น `useDebounce`, `useWindowSize`, `useApi` สำหรับดักจับ Loading/Error ทั่วแอป)
- `utils/`: ฟังก์ชันคำนวณหรือตัวช่วยทั่วไป

### 2. `src/modules/` (Feature Modules)
แต่ละฟีเจอร์ต้องเป็นอิสระและมีโครงสร้างภายในที่ชัดเจน ตัวอย่างมาตรฐานที่เราใช้:

*   **`hooks/` (Feature-specific Hooks):**
    *   **ที่เก็บ:** `src/modules/<feature_name>/hooks/`
    *   **หน้าที่:** จัดการ Business Logic, เรียก API, หรือควบคุม State *เฉพาะของโมดูลนั้นๆ*
    *   **ตัวอย่าง:** `useCart` (ใน modules/cart), `useCheckout` (ใน modules/checkout), `useProductManager` (ใน modules/admin/products)
    *   **ทำไมไม่ไว้ใน Shared?:** เพราะถ้าวันหนึ่งเราถอดโมดูลนี้ทิ้ง (เช่น ไม่เอาตะกร้าสินค้าแล้ว) เราสามารถลบโฟลเดอร์ `modules/cart/` ทิ้งได้เลยโดยไม่กระทบกับแอปส่วนอื่น

#### 📦 `modules/cart/` (Client-side Focused)
- **หน้าที่**: จัดการรายการสินค้าในตะกร้าเบื้องต้น (Client-side / LocalStorage / จัดการจำนวน)
- `hooks/useCart.js`: หัวใจสำคัญที่ทำหน้าที่ "แปลงข้อมูลตะกร้า" (Local) ส่งให้ Summary แสดงผล

#### 📦 `modules/checkout/` (Security & API Focused)
- **หน้าที่**: จัดการกระบวนการสั่งซื้อที่มีความปลอดภัยสูง (Address / Payment / Order Submission)
- `components/`: UI เฉพาะ เช่น `AddressSelector.jsx`, `PaymentMethodSelector.jsx`
- `hooks/` & `services/`: จัดการ Logic และ API เฉพาะของโมดูล
- `index.js`: **ประตูหลัก (Barrel File)** ทำหน้าที่ Re-export ทุกตัวรวมถึง Shared Components ออกไปให้หน้า Page ใช้งาน

#### 📦 `modules/payment/` (Gateway & Integration)
- **หน้าที่**: จัดการระบบชำระเงินและตรวจสอบยอดโอน (PromptPay / QR Code)
- **Pattern สำคัญ**: มีการ Re-export คอมโพเนนต์จากโมดูลเพื่อนบ้าน (เช่น `CheckoutItemsList`) ผ่าน `index.js` เพื่อให้หน้า Page เรียกใช้ได้จากที่เดียว (Centralized Import)

...

#### 📦 `modules/admin/` (The Management Core)
โมดูลแอดมินถูกออกแบบมาให้จัดการข้อมูลขนาดใหญ่และมีความซับซ้อนสูง โดยใช้โครงสร้างแบบ **Centralized Admin Services**:

- **`services/` (The Mother):** ศูนย์รวม API ทั้งหมดของ Admin (Products, Orders, Users) เพื่อให้ทุกหน้าใช้มาตรฐานเดียวกันและแก้ไขได้ที่จุดเดียว
- **Feature Folders (Add, List, Details):** แต่ละฟีเจอร์จะมี Hook และ UI ของตัวเอง แต่จะเรียกใช้ API จาก "ตัวแม่" เสมอ เพื่อความยืดหยุ่นในการขยายระบบ

---

### 3. `src/layouts/` & `src/pages/`
- **Layouts**: โครงร่างหน้า (MainLayout, AdminLayout)
- **Pages**: จุดรวมตัวของ Modules และ Layouts เพื่อสร้าง Route (ห้ามเขียน Logic ยาวเหยียดในนี้)

### 4. `vite.config.js` (The Navigator)
- **Path Aliasing**: ใช้ `@` เพื่อชี้ไปยังโฟลเดอร์ `src/` เสมอ เพื่อป้องกันปัญหา Path พังเมื่อมีการย้ายตำแหน่งไฟล์ (Relative Path Hell)
- **Alias Requirement**: ทุกการ Import ข้ามโฟลเดอร์หลัก (Modules -> Shared หรือ Pages -> Modules) ต้องใช้ `@/` นำหน้าเสมอ
