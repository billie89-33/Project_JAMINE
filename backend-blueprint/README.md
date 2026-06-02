# 🚀 Backend API Blueprint for Jamine Admin Dashboard

เอกสารชุดนี้คือโครงสร้าง API ที่ฝั่ง Frontend ได้ออกแบบและรองรับไว้แล้ว เพื่อให้ทีม Backend นำไปสร้าง Endpoints ให้ตรงกัน

## 🛠️ ข้อมูลทางเทคนิค
- **Base URL:** `/api/v1/admin/dashboard`
- **Response Format:** ทุก API ต้องส่งกลับในรูปแบบ JSON:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Authentication:** รองรับ **HttpOnly Cookies** (Credentials: true)

## 📂 โครงสร้างไฟล์ที่แนะนำ
1. `models/Order.js`: Schema สำหรับออเดอร์
2. `models/Product.js`: Schema สำหรับสินค้า
3. `controllers/dashboardController.js`: Logic การคำนวณ (ใช้ MongoDB Aggregation)
4. `routes/adminDashboardRoutes.js`: เส้นทาง API ทั้งหมด

## 📈 รายการ Endpoints ที่ต้องมี:
- `GET /summary?period=week`: สรุปยอดเงินและจำนวนออเดอร์
- `GET /revenue-chart?period=week`: ข้อมูลสำหรับวาดกราฟเส้นรายได้
- `GET /category-sales?period=week`: ข้อมูลสัดส่วนการขายตามหมวดหมู่
- `GET /recent-orders?limit=5`: รายการออเดอร์ล่าสุด
- `GET /top-products?limit=3`: สินค้าขายดี 3 อันดับแรก

---
*จัดทำโดย Gemini CLI - พร้อมสำหรับการเชื่อมต่อ*
