# 📰 10. Placement-Driven UI & Advanced CMS Patterns

เอกสารนี้รวบรวมเทคนิคการออกแบบระบบจัดการเนื้อหา (CMS) และสื่อ ที่เน้นความยืดหยุ่น ประสิทธิภาพ และความถูกต้องของข้อมูล

---

## 🏗️ 1. Placement-Driven UI Pattern (UI ขับเคลื่อนด้วยตำแหน่ง)
**ปัญหา:** การสร้างคอมโพเนนต์แยกตามหน้าจอทำให้โค้ดซ้ำซ้อน
**✅ Best Practice:**
ใช้ฟิลด์ **`placement`** ใน Database เพื่อระบุตำแหน่ง และใช้คอมโพเนนต์เดียวที่รับค่า `placement` ไปดึงข้อมูลมาแสดงผลอัตโนมัติ

---

## ✍️ 2. Cloud-Integrated Rich Text Editor (v2.0)
**ปัญหา:** การแทรกรูปภาพปกติจะเปลี่ยนรูปเป็น Base64 ขนาดยักษ์ ทำให้ Database บวม
**✅ Best Practice:**
1. **Direct Upload Handler:** ดักจับ Event แทรกรูปใน Editor (เช่น `react-quill-new`)
2. **Cloudinary Sync:** ส่งรูปขึ้น Cloudinary ทันทีและนำ URL มาวางแทน Base64 เพื่อรักษา Performance
3. **Atomic Cleanup:** หากการบันทึกบทความล้มเหลวหลังอัปโหลดรูป ต้องมีระบบลบรูปออกจาก Cloud เพื่อไม่ให้เปลืองพื้นที่

---

## 🇹🇭 3. Bulletproof Thai Slug Generation
**ปัญหา:** การสร้าง URL จากภาษาไทยมักเจอบั๊กตัวอักษรหาย หรือ Slug ว่างจนบันทึกไม่ได้
**✅ Best Practice:**
ใช้ **Thai-Aware Regex** (`\u0E00-\u0E7F`) ในการกรอง และมีระบบ **Timestamp Fallback** เสมอเพื่อป้องกันกรณีชื่อที่กรอกมามีแต่อักขระพิเศษ

---

## 📊 4. Server-Side Data Aggregation (Stat Integrity)
**ปัญหา:** การคำนวณสถิติที่หน้าบ้าน (เช่น ยอดจ่ายรวม) มักคลาดเคลื่อน
**✅ Best Practice:**
ใช้คำสั่ง **MongoDB Aggregate** ที่ฝั่ง Backend เพื่อคำนวณจาก Database โดยตรง แล้วส่งผลลัพธ์ที่คำนวณเสร็จแล้วมาให้ Frontend แสดงผลเท่านั้น

---

## ♻️ 5. Media Lifecycle Management
**✅ Best Practice:**
ทุกครั้งที่มีการ **Delete** หรือ **Update** รูปภาพ Backend ต้องรับหน้าที่ลบไฟล์เดิมใน Storage (เช่น Cloudinary) ทิ้งทันที โดยอ้างอิงจาก `publicId` เพื่อป้องกันไฟล์ขยะในระบบ

---

## ⚡ 6. Data Normalization for Form (FormData Handling)
**ปัญหา:** การส่งผ่าน `FormData` จะทำให้ข้อมูลทุกอย่างกลายเป็น String
**✅ Best Practice:**
Backend ต้องทำ **Type Casting** (แปลงประเภทข้อมูล) ให้ถูกต้องก่อนบันทึก เช่น `Number(price)` หรือ `isPublished === 'true'` เพื่อความถูกต้องของ Schema

---

## 🖼️ 7. Dynamic Category Visuals (Auto-Image Mapping)
**✅ Best Practice:**
ออกแบบ API หมวดหมู่ให้ดึงรูปภาพของ **"สินค้าตัวล่าสุด"** ในหมวดหมู่นั้นๆ มาแสดงเป็นรูปประจำหมวดหมู่โดยอัตโนมัติ เพื่อให้หน้าเว็บดูมีการเคลื่อนไหวตลอดเวลาโดยที่ Admin ไม่ต้องจัดการเอง

---
*Updated: 2026-06-15 | มาตรฐานระบบจัดการเนื้อหา Jamine Project*
