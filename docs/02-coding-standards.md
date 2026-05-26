# 📜 02. Coding Standards & Patterns

กฎเหล็กเพื่อรักษาคุณภาพโค้ดให้สม่ำเสมอทั้งทีม

## 🌟 กฎ 3 ข้อหลัก (Strict Rules)
1. **The Barrel File Rule (`index.js`)**: ทุกโมดูลต้องมี `index.js` โค้ดภายนอกห้าม Import ลึกเข้าไปข้างใน ให้เรียกผ่านประตูหลักเท่านั้น
2. **Abstract Naming Rule**: ตั้งชื่อตามหน้าที่ (Role-based) ไม่ใช่เทคนิค เช่น `ProductGrid.jsx` แทน `ProductSwitchCase.jsx`
3. **Dependency Direction Rule**: `modules` -> `shared` (อนุญาต) | `modules` <-> `modules` (ห้ามเจาะลึก ต้องผ่าน index.js เท่านั้น)
4. **Absolute Import Rule (`@/`)**: ห้ามใช้ `../../` ข้ามไปยังโฟลเดอร์หลักอื่น ให้ใช้ `@/` เพื่อความชัดเจนและป้องกันบั๊กเวลาทำการ Refactor

## 🛠️ Patterns & Naming ที่ต้องใช้
- **Feature-Specific Separation**: เมื่อฟีเจอร์มีความซับซ้อน (เช่น Product List vs Product Detail) ให้แยกเป็นคนละโมดูลทันที เพื่อลดการปนกันของ Logic
- **PascalCase for Components**: ตั้งชื่อไฟล์และ Component ด้วยตัวพิมพ์ใหญ่เสมอ เช่น `ProductCard.jsx`
- **Container/Presentational**: แยก Logic (สมอง) ออกจาก UI เสมอ
- **Barrel Export**: ใช้ในทุกโฟลเดอร์หลักเพื่อให้ Path สะอาด
- **Single Source of Truth**: เก็บ Mock Data หรือค่าคงที่ไว้ที่ `src/data/` หรือจุดศูนย์กลางเพียงที่เดียว

## ❌ Forbidden List (สิ่งที่ห้ามทำ)
- **Fat Pages**: อย่าเขียน Logic ยาวใน Page ให้โยนลงไปใน Feature Component/Hook
- **Duplicate Imports**: ตรวจสอบการ Import ซ้ำซ้อน (เช่น `useAuth` จากทั้งตรงและ Barrel)
- **Hardcoded Data**: ห้ามประกาศข้อมูลเดิมซ้ำๆ หลายไฟล์
- **Leading Numbers**: ห้ามใช้ตัวเลขนำหน้าชื่อไฟล์ (เช่น `01_Nav.jsx`)
- **Orphan Files (ไฟล์ขยะ)**: ไฟล์ทดสอบที่ไม่ได้ใช้ หรือไฟล์ว่างเปล่า ห้ามทิ้งไว้ในระบบ ควรลบทิ้งทันที
