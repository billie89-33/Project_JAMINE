# 📋 15. แผนการสร้างหน้าจัดการ Inventory และ Order Status

เอกสารฉบับนี้สรุปแผนการสร้าง 2 ฟีเจอร์ใหม่ เพื่อแยกงานจัดการรายละเอียดออกจากหน้า Dashboard หลัก ตามมาตรฐาน Modular Architecture

---

## 📦 1. Inventory Management (การจัดการคลังสินค้า)
**Path:** `/admin/inventory`
**เป้าหมาย:** แก้ไขปัญหาสินค้าขาดสต็อกได้อย่างรวดเร็ว

### 🎨 รายละเอียด UI (Wireframe)
- **Top Metrics:** แสดงการ์ด 2 ใบ (🔴 หมดสต็อก | 🟡 สต็อกต่ำ)
- **Inventory Table:** 
    - แสดงรายการสินค้า, หมวดหมู่, และจำนวนคงเหลือ
    - **Editable Threshold:** ช่องกรอกตัวเลข "จุดแจ้งเตือน" ที่แก้ไขได้ทันทีในตาราง
- **Quick Stock Update:** ปุ่มแก้ไขด่วน (📝) เปิด Modal เพื่อบวก/ลบ จำนวนสต็อกโดยไม่ต้องเข้าหน้า Edit Product เต็ม

### 🛠️ งานฝั่ง Backend ที่ต้องเตรียม
- `GET /api/v1/admin/inventory`: ดึงรายการสินค้าพร้อมสถานะสต็อก (รองรับ Pagination)
- `PATCH /api/v1/admin/products/:id/stock`: อัปเดตเฉพาะจำนวนสต็อก (Surgical Edit)
- `PATCH /api/v1/admin/products/:id/threshold`: อัปเดตจุดแจ้งเตือนสต็อกต่ำ

---

## 🚚 2. Order Tracking Center (ศูนย์ติดตามสถานะ)
**Path:** `/admin/orders`
**เป้าหมาย:** ควบคุมลำดับงานและเปลี่ยนสถานะออเดอร์ได้อย่างมีประสิทธิภาพ

### 🎨 รายละเอียด UI (Wireframe)
- **Status Distribution:** กราฟวงกลม (Pie Chart) แสดงสัดส่วนออเดอร์ตามสถานะ
- **Order Flow Table:**
    - ตารางรายการออเดอร์ทั้งหมด
    - **Inline Status Switcher:** ช่อง Dropdown ในตารางสำหรับเปลี่ยนสถานะ (เช่น จาก Processing -> Shipped)
    - **Payment Indicator:** สัญลักษณ์แสดงสถานะการชำระเงิน (Paid/Unpaid)
- **Quick Detail View:** กดที่ Order ID เพื่อเปิด Drawer ดูรายการสินค้าในออเดอร์นั้นๆ

### 🛠️ งานฝั่ง Backend ที่ต้องเตรียม
- `GET /api/v1/admin/orders`: ดึงรายการออเดอร์ทั้งหมดพร้อม Filter ตามสถานะ
- `PATCH /api/v1/admin/orders/:id/status`: อัปเดตสถานะออเดอร์ (เช่น ส่งของแล้ว, ยกเลิก)

---

## 🚀 ขั้นตอนการเริ่มงานในวันพรุ่งนี้
1.  **Scaffolding:** สร้างโฟลเดอร์โมดูลใหม่ใน `src/modules/admin/inventory` และ `src/modules/admin/orders`
2.  **Routing:** ลงทะเบียนเส้นทางใหม่ใน `AppRouter.jsx`
3.  **Components:** เริ่มสร้าง Table Component พื้นฐานที่รองรับการแก้ไขข้อมูลในตัว (Inline Editing)
4.  **API Integration:** เชื่อมต่อกับ Backend Blueprints ที่เราวางไว้

---
*จัดทำโดย Gemini CLI - เตรียมพร้อมสำหรับวันพรุ่งนี้ครับ!*
