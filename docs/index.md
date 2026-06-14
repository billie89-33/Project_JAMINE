# 📚 Jamine Project Documentation Index

รวบรวมคู่มือและมาตรฐานการพัฒนาสำหรับ Jamine Project เพื่อรักษาคุณภาพระดับ Enterprise

---

## 🏗️ พื้นฐานและสถาปัตยกรรม (Core Architecture)

1. [**Architecture & Directory Structure**](./01-architecture.md)
   - มาตรฐานการวางโครงสร้างโปรเจกต์ เพื่อให้โค้ดสะอาด ปลอดภัย และขยายระบบได้ง่าย
   - **ใช้อ่านเมื่อ:** วางโครงสร้างโมดูลใหม่, แยกไฟล์ Shared vs Modules

2. [**Coding Standards & Patterns**](./02-coding-standards.md)
   - กฎการเขียนโค้ดและการตั้งชื่อ, การทำ Barrel Export (index.js), การทำ Absolute Import (@/)
   - **ใช้อ่านเมื่อ:** สร้าง Component ใหม่, ตรวจสอบความสะอาดของโค้ด

3. [**API & Cookie Integration (Master Guide)**](./03-api-services.md)
   - มาตรฐานการเชื่อมต่อ Backend, การจัดการ HttpOnly Cookies, การตั้งค่า Axios Interceptors
   - **ใช้อ่านเมื่อ:** ทำระบบ Login, เชื่อมต่อ API ใหม่, จัดการ Error/Retry

---

## 🧠 การจัดการสถานะและตรรกะ (State & Logic)

4. [**State & Context Management**](./04-state-management.md)
   - การใช้ AuthContext, การแชร์ข้อมูล Global State, การป้องกัน Context Hell
   - **ใช้อ่านเมื่อ:** ต้องแชร์ข้อมูลข้ามหน้า, สร้าง Provider ใหม่

11. [**Global State Orchestration & Cart Sync**](./11-global-state-cart-sync.md)
    - ระบบตะกร้าสินค้า (Cart), การซิงค์ยอดสินค้าใน Navbar แบบ Real-time
    - **ใช้อ่านเมื่อ:** ทำระบบตะกร้า, จัดการสถานะที่ต้องซิงค์กันทั้งแอป

21. [**Infinite Loop Prevention & useEffect Mastery**](./21-infinite-loop-prevention.md)
    - วัคซีนป้องกัน Infinite Loop, การจัดการ Dependencies, และ Reference Equality
    - **ใช้อ่านเมื่อ:** เจอแอปค้าง, API ยิงรัวๆ, หรือเขียน useEffect ที่ซับซ้อน

---

## 🎨 UI, UX & Security

5. [**UX, Security & Safety**](./05-ux-security.md)
   - การทำ Toast Notification, Loading State (Skeleton), ความปลอดภัยของฟอร์ม
   - **ใช้อ่านเมื่อ:** ต้องการเพิ่มความเนี๊ยบให้ UI หรือเพิ่มระบบแจ้งเตือน

10. [**Placement-Driven UI & CMS Patterns**](./10-placement-driven-ui.md)
    - ระบบ Banner, การจัดการสื่อ (Cloudinary), ระบบ CMS ที่คุมด้วย Database
    - **ใช้อ่านเมื่อ:** ทำระบบ Banner, จัดการรูปภาพ Dynamic, หรือใช้ Rich Text Editor

13. [**High-Resilience Patterns (Stable & Scalable)**](./13-resilience-patterns.md)
    - การป้องกันหน้าจอขาว (Crash), การทำกราฟ (Charts), การจัดการ Cold Start Server
    - **ใช้อ่านเมื่อ:** ทำหน้า Admin Dashboard, จัดการ API พร้อมกันหลายเส้น

---

## 🛒 E-commerce & Logistics

12. [**Financial Summary Standards**](./12-financial-summary-standards.md)
    - มาตรฐานหน้า Checkout, การสรุปยอดเงิน, ความถูกต้องของตัวเลขและการชำระเงิน
    - **ใช้อ่านเมื่อ:** ทำหน้าสรุปยอด, ระบบจ่ายเงิน เพื่อรักษาความแม่นยำของตัวเลข

19. [**E-commerce Order Workflow & Resilience**](./19-ecommerce-order-workflow-patterns.md)
    - ระบบจัดการออเดอร์, หน้า Order Detail (Modal), ระบบสินค้าขายดี (Top Seller)
    - **ใช้อ่านเมื่อ:** พัฒนาระบบออเดอร์ หรือระบบจัดอันดับสินค้า

20. [**Logistics & Shipping Patterns**](./20-logistics-shipping-patterns.md)
    - การพัฒนาระบบขนส่งให้ยืดหยุ่น (Defensive Mapping), กฎการเปลี่ยนสถานะออเดอร์
    - **ใช้อ่านเมื่อ:** ทำระบบเลือกบริษัทขนส่ง หรือติดตามสถานะพัสดุ

---

## 🛠️ การตรวจสอบและพัฒนา (Engineering & Debugging)

6. [**Frontend Debugging Guide**](./06-frontend-debugging.md)
   - การเช็ค Network, การ Debug Cookies ใน Browser, การใช้ debugger
   - **ใช้อ่านเมื่อ:** หน้าเว็บขาว, API ยิงไม่ไป, หรือหาบั๊กไม่เจอ

7. [**Event Handling & Separation of Concerns**](./07-event-handling.md)
   - การแยก Logic ออกจาก UI, การเขียน Custom Hooks (use...)
   - **ใช้อ่านเมื่อ:** โค้ดในไฟล์ JSX เริ่มยาวเกินไป หรือต้องการใช้ตรรกะซ้ำ

14. [**Instrumentation & Performance Monitoring**](./14-instrumentation-monitoring.md)
    - การวัดความเร็ว API, การ Debug บัคค้างหรือระบบช้า, การวางระบบ Log
    - **ใช้อ่านเมื่อ:** ระบบทำงานช้า หรือต้องการวัดประสิทธิภาพเครื่องแม่ข่าย

16. [**Dynamic Architecture & Refactoring Lessons**](./16-dynamic-refactor-lessons.md)
    - บทเรียนจากการเปลี่ยน Hardcode เป็น Dynamic, การทำ Key-Value Builder
    - **ใช้อ่านเมื่อ:** ต้องการยกระดับฟีเจอร์เดิมให้ขยายตัวได้ (Scalable)

17. [**Dynamic Specification Template**](./17-dynamic-spec-template-setup.md)
    - ระบบ Auto-suggest สเปคสินค้าจากฐานข้อมูล
    - **ใช้อ่านเมื่อ:** พัฒนาระบบหลังบ้านให้กรอกข้อมูลง่ายขึ้น

---
*อัปเดตล่าสุด: 2026-06-15 | มาตรฐานสูงสุดของ Jamine Project*
