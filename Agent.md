# Project Agent Guide: Jamine Project & Universal Best Practices 🚀

ไฟล์นี้สรุปโครงสร้างโปรเจกต์ Flow การทำงาน บทเรียนที่ได้รับ และ Pattern สำคัญ เพื่อใช้เป็นมาตรฐานสำหรับโปรเจกต์นี้และโปรเจกต์ต่อๆ ไป

---

## 🏗️ 1. Architecture: Modular & Feature-based
เราใช้สถาปัตยกรรมแบบ **Modular Feature-based** ซึ่งช่วยให้โค้ดขยายตัวได้ง่าย (Scalable):

### Hierarchy (ระดับชั้นของโค้ด):
1. **Pages (`src/pages/`)**: "โครงสร้างหน้า" (Layout & Entry Point) จัดวางพื้นที่ แต่ไม่ต้องถือ Logic การยิง API
2. **Feature Components (`src/components/features/`)**: "สมอง" (Logic & State) จัดการเรื่อง Form, API Call และข้อมูลเฉพาะฟีเจอร์
3. **Common Components (`src/components/common/`)**: "UI พื้นฐาน" ที่ใช้ซ้ำได้ทั่วไป (เช่น Navbar, Footer, Buttons)

---

## ✅ 2. Universal Coding Patterns (สิ่งที่ควรทำ)

### 🌟 1. Barrel Export Pattern (index.js)
ใช้ไฟล์ `index.js` ในทุกโฟลเดอร์หลักเพื่อรวบรวมการส่งออก ช่วยให้การ Import สะอาดและสั้นลง
- **ตัวอย่าง**: `import { HomePage, CategoryPage } from '../pages/user';`
- **ข้อดี**: ลดความซับซ้อนของ Path และทำให้โค้ดดูเป็นระเบียบ

### 🌟 2. Container/Presentational Pattern
แยก Logic การยิง API และ State ออกจาก Page ไปไว้ใน Component ย่อย
- **ตัวอย่าง**: `LoginPage` (Layout) -> `LoginForm` (Logic/API)
- **ข้อดี**: Page จะสะอาดมาก และสามารถนำ Component (สมอง) ไปใช้ซ้ำที่อื่นได้ง่าย

### 🌟 3. Single Source of Truth (Data Centralization)
เก็บข้อมูลจำลอง (Mock Data) หรือค่าคงที่ไว้ที่จุดเดียว เช่น `src/data/products.data.js`
- **ข้อดี**: แก้ไขที่เดียว ข้อมูลเปลี่ยนทั้งเว็บ ป้องกันข้อมูลไม่ตรงกัน (Data Inconsistency)

---

## 🛡️ 3. Safeguards & Best Practices

- **SPA Navigation**: ใช้ `<Link>` หรือ `<NavLink>` แทน `<a>` เสมอเพื่อป้องกันหน้ากระตุกและคงความเร็ว SPA
- **PascalCase for Components**: ตั้งชื่อไฟล์ด้วยตัวใหญ่เสมอ เช่น `ProductCard.jsx`
- **Scope Integrity**: เมื่อย้ายโค้ด (Refactor) ต้องเช็คการประกาศ `useNavigate`, `useAuth`, `useParams` ในไฟล์ใหม่เสมอ
- **Syntax Check**: ตรวจสอบปีกกา `{}` ปิดฟังก์ชันทุกครั้งหลังการย้ายโค้ด (จุดที่พลาดบ่อยที่สุด)

---

## ❌ 4. Common Mistakes (สิ่งที่ไม่ควรทำ - "The Forbidden List")

- **ห้ามปล่อยให้ Page บวม (Fat Pages)**: อย่าเขียน Logic ยาวเหยียดใน Page ให้โยนลงไปใน Feature Component
- **ห้ามประกาศ Import ซ้ำซ้อน (Duplicate Imports)**: ตรวจสอบไม่ให้มีการ Import ตัวแปรเดียวกัน (เช่น `useAuth`) จากทั้งแบบตรงและแบบ Barrel ในไฟล์เดียว
- **ห้ามใช้ตัวเลขนำหน้าชื่อไฟล์**: เช่น `01_Navbar.jsx` (เปลี่ยนเป็น `Navbar.jsx`)
- **ห้าม Hardcode ข้อมูลซ้ำซ้อน**: อย่าประกาศรายการสินค้าชุดเดียวกันในหลายๆ ไฟล์
- **ห้ามทิ้งไฟล์ขยะ (Orphan Files)**: ไฟล์ทดสอบที่ไม่ได้ใช้ หรือไฟล์ว่างเปล่า ควรลบทิ้งทันที

---

## 🔄 5. Jamine Project Flow (Updated)

### 🔐 Authentication Flow:
- **Modular Context**: `AuthContext.jsx` รวม Provider และ useAuth hook ไว้ด้วยกันแบบจบในตัว
- **Login/Register**: ยิง API ผ่าน Feature Components -> อัปเดต Context -> แจ้งเตือนผ่าน `react-hot-toast` -> `navigate`

---

## 💡 Pro-Tip สำหรับ Agent คนถัดไป
1. **Check the Index**: เมื่อเพิ่มไฟล์ใหม่ ต้องไปลงทะเบียนใน `index.js` ของโฟลเดะนั้นเสมอ
2. **Brace Integrity**: หากหน้าจอขาวหลัง Refactor ให้เช็คปีกกาปิดฟังก์ชันเป็นอันดับแรก
3. **Toast for UX**: ใช้ `toast.success()` หรือ `toast.error()` เสมอเมื่อมีการตอบโต้กับ API เพื่อ UX ที่ดี

---
*Updated by Gemini CLI Agent - 2026-05-25 (Architecture Optimization Phase)*
