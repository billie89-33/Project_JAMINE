# 📜 02. Coding Standards & Patterns

กฎเหล็กเพื่อรักษาคุณภาพโค้ดให้สม่ำเสมอทั้งทีม

## 🌟 กฎ 3 ข้อหลัก (Strict Rules)

1.  **The Barrel File Rule (`index.js`):** ทุกโมดูลต้องมี `index.js` โค้ดภายนอกห้าม Import ลึกเข้าไปข้างใน ให้เรียกผ่านประตูหลักเท่านั้น
2.  **Abstract Naming Rule:** ตั้งชื่อตามหน้าที่ (Role-based) ไม่ใช่เทคนิค เช่น `ProductGrid.jsx` แทน `ProductSwitchCase.jsx`
3.  **Dependency Direction Rule:** `modules` -> `shared` (อนุญาต) | `modules` <-> `modules` (ห้ามเจาะลึก ต้องผ่าน index.js เท่านั้น)
4.  **Absolute Import Rule (@/):** ห้ามใช้ `../../` ข้ามไปยังโฟลเดอร์หลักอื่น ให้ใช้ `@/` เพื่อความชัดเจน

---

## 🎨 มาตรฐานการเขียน Component (React)

### 1. Functional Components & Hooks
- ใช้การประกาศแบบ **Arrow Function** และส่งออกเป็น `export default` ท้ายไฟล์
- แยก Logic ที่ซับซ้อนออกไปไว้ใน **Custom Hooks** เสมอ

### 2. Props Management
- ใช้ **Destructuring Props** ในการรับข้อมูลเข้า
- ห้ามส่งข้อมูลลงไปลึกเกิน 3 ชั้น (Prop Drilling) หากจำเป็นให้ใช้ Context หรือ Shared Hook แทน

---

## 🧹 มาตรฐานความสะอาด (Clean Code)

- **DRY (Don't Repeat Yourself):** หากพบโค้ดที่ซ้ำกันเกิน 2 ที่ ให้ย้ายไปไว้ที่ `shared`
- **Single Responsibility:** 1 ไฟล์ = 1 หน้าที่หลัก (1 Component หรือ 1 Hook)
- **Early Return:** ใช้การรีเทิร์นค่ากลับทันทีหากเงื่อนไขไม่ผ่าน เพื่อลดการเขียน `if-else` ซ้อนกัน (Nested)

---
*อัปเดตล่าสุดเพื่อให้ Gemini CLI ทำงานได้แม่นยำขึ้น - 2026-05-31*
