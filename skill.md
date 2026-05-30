# 📚 Project Skills & Best Practices

ไฟล์นี้รวบรวมเทคนิคพิเศษและมาตรฐานการเขียนโค้ดที่ใช้ในโปรเจกต์ Jamine เพื่อความยืดหยุ่นและรองรับการขยายตัว

---

### 🧩 1. Modular Smart Pagination Pattern (React)

เทคนิคการทำระบบแบ่งหน้าแบบอัตโนมัติที่ยืดหยุ่นและรองรับ Enterprise Architecture

#### **โครงสร้างความรับผิดชอบ (Responsibility Chain):**
1.  **Parent Page (หน้าแม่):** ถือ State กลาง (`currentPage`, `totalPages`) และส่งฟังก์ชันอัปเดตลงไป
2.  **Product Module (ตัวกลาง):** รับ Props และกระจายไปยังหมวดหมู่ย่อย (Switch Case)
3.  **Specs Component (ลูก):** คำนวณข้อมูล (หรือเรียก API) และรายงานจำนวนหน้ากลับไปหาแม่ผ่าน `setTotalPages`
4.  **Pagination Component (UI):** แสดงผลปุ่มตามข้อมูลที่ได้รับ และสั่งเปลี่ยนหน้าผ่าน `onPageChange`

#### **จุดเด่น (Key Features):**
- **Auto-Hide:** ระบบจะซ่อนตัวตนอัตโนมัติหากมีข้อมูลเพียงหน้าเดียว (`totalPages <= 1`)
- **Safe Navigation:** มีฟังก์ชัน `handlePageChange` ดักหน้าติดลบ หรือหน้าเกินจริง
- **Dynamic Items per Page:** กำหนดจำนวนสินค้าต่อหน้าได้อิสระในแต่ละหมวดหมู่

---

### 📡 2. API Integration Strategy (Server-Side Pagination)
เมื่อเปลี่ยนจาก Mock Data เป็น API จริง ให้ยึดหลักการดังนี้:
1.  **Frontend:** ส่ง Query `?page=X&limit=Y` ไปยัง Backend เสมอ
2.  **Backend:** ใช้ `.skip()` และ `.limit()` ใน MongoDB เพื่อดึงข้อมูลเฉพาะส่วนที่ต้องการ
3.  **Response:** ต้องส่ง `totalPages` และ `total` กลับมาใน Response Object เสมอเพื่อให้ Frontend วาดปุ่มได้ถูกต้อง

---

### 🖼️ 3. Dynamic Specifications Mapping
การใช้ `Object.entries()` เพื่อวนลูปแสดงผลข้อมูลสเปกที่เก็บแบบ Map ใน Database ช่วยให้รองรับสินค้าทุกหมวดหมู่โดยไม่ต้องแก้โค้ด UI

---

### 🔐 4. Secure API Client
การตั้งค่า `withCredentials: true` และการใช้ HttpOnly Cookies เป็นมาตรฐานความปลอดภัยสูงสุดในการจัดการ Session
