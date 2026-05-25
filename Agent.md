# Project Agent Guide: Jamine Project & Universal Best Practices 🚀

ไฟล์นี้สรุปโครงสร้างโปรเจกต์ Flow การทำงาน และบทเรียนที่ได้รับ เพื่อใช้เป็นมาตรฐานสำหรับโปรเจกต์นี้และโปรเจกต์ต่อๆ ไป

---

## 🏗️ 1. Architecture: Modular & Feature-based
เราใช้สถาปัตยกรรมแบบ **Modular Feature-based** ซึ่งช่วยให้โค้ดขยายตัวได้ง่าย (Scalable):

### 层次结构 (Hierarchy):
1. **Pages (`src/pages/`)**: ทำหน้าที่เป็น "โครงสร้างหน้า" (Layout & Entry Point) จัดวางพื้นที่ แต่ไม่ต้องถือ Logic การยิง API
2. **Feature Components (`src/components/features/`)**: ทำหน้าที่เป็น "สมอง" (Logic & State) จัดการเรื่อง Form, API Call และการคำนวณต่างๆ
3. **Common Components (`src/components/common/`)**: UI พื้นฐานที่ใช้ซ้ำได้ทั่วไป (Atomic/Shared UI)

---

## ✅ 2. Universal Best Practices (สิ่งที่ควรทำ)

### 🚀 Modular Refactoring (การแยกส่วนประกอบ)
- **แยก Logic ออกจาก Page**: ย้าย Form State และ API Calls ไปไว้ใน Feature Component (เช่น `LoginForm.jsx`) เพื่อให้ Page เหลือแค่โครงสร้างที่สะอาด
- **Self-Contained Modules**: พยายามทำให้ Feature Component จัดการตัวเองได้จบในตัว (ดึง Hooks, APIs, และ Assets ของตัวเอง)

### 📂 Clean Code & Structure
- **PascalCase for Components**: ตั้งชื่อไฟล์ด้วยตัวใหญ่เสมอ (เช่น `ProductCard.jsx`)
- **Single Source of Truth**: เก็บข้อมูลจำลอง (Mock Data) ไว้ที่ศูนย์กลาง (เช่น `src/data/`)
- **SPA Optimization**: ใช้ `<Link>` หรือ `<NavLink>` แทน `<a>` เพื่อรักษาความเร็วของแอป

### 🛡️ Code Integrity (ความถูกต้องของโค้ด)
- **Scope Checking**: เมื่อย้ายโค้ดจาก Page ไปยัง Component **ต้องตรวจสอบการประกาศตัวแปร** (เช่น `navigate`, `location`, `params`) ว่าได้ดึงมาใช้ใหม่ในไฟล์นั้นหรือยัง
- **Syntax Verification**: ตรวจสอบปีกกา `{}` และวงเล็บ `()` เสมอหลังการ Refactor ครั้งใหญ่

---

## ❌ 3. Common Mistakes (สิ่งที่ไม่ควรทำ)

- **ห้ามปล่อยให้ Page บวม (Fat Pages)**: อย่าเขียน Logic ทั้งหมดในไฟล์หน้าเดียว (Page) เพราะจะทำให้ดูแลรักษายาก
- **ห้ามลืมตรวจสอบ Variable Scope**: การ Copy โค้ดไปวางในไฟล์ใหม่โดยไม่นำเข้า (Import) หรือประกาศตัวแปรใหม่ จะทำให้เกิด Runtime Error ทันที
- **ห้ามใช้ตัวเลขนำหน้าชื่อไฟล์**: เสียมาตรฐานการทำงานและหาไฟล์ยาก
- **ห้ามใช้ `<a>` สำหรับลิงก์ภายใน**: ทำให้เสียคุณสมบัติของ Single Page Application (SPA)

---

## 🔄 4. Jamine Project Flow (Updated)

### 🔐 Authentication Flow:
- **Modular Login**: `LoginPage` แสดงผล -> เรียกใช้ `LoginForm` -> `LoginForm` ยิง API -> อัปเดต `AuthContext` -> สั่ง `navigate` กลับหน้าหลัก

### 🛣️ Routing Flow:
- **Public/Protected/Dynamic**: แบ่งแยกสิทธิ์ด้วย Guards และดึงข้อมูลตาม URL Parameters (`:id`, `:type`)

---

## 💡 Pro-Tip สำหรับ Agent คนถัดไป
เมื่อต้องทำการย้าย Logic (Refactor) จาก Page ไปยัง Component:
1. **เตรียม Imports**: เช็ค `useNavigate`, `useLocation`, `useParams` และ API functions
2. **Check the Braces**: ตรวจสอบปีกกาปิดฟังก์ชันให้ดี (จุดนี้เคยพลาดและทำให้หน้าจอขาว)
3. **Keep it Clean**: หลังจากย้ายสำเร็จ ให้ลบโค้ดเก่าที่ไม่ได้ใช้ใน Page ทันที

---
*Updated by Gemini CLI Agent - 2026-05-25 (Post-Refactoring Audit)*
