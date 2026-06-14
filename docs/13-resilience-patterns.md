# 🛡️ 13. High-Resilience Patterns (Stable & Scalable)

เอกสารชุดนี้สรุป "บทเรียนราคาแพง" และ "Best Practices" จากการพัฒนา Admin Dashboard และ Product Management เพื่อเป็นมาตรฐานในการสร้างระบบที่เสถียร (Stable) และยืดหยุ่นพอที่จะนำไปใช้กับโปรเจกต์อื่นได้ทันที

---

## 🛑 1. Defensive Rendering Pattern (กันหน้าจอขาว)
**ปัญหา:** เมื่อ API ส่งข้อมูลล่าช้า หรือส่งข้อมูลมาไม่ครบ (null/undefined) การเรียกใช้ `.map()`, `.reduce()` หรือ `.toLocaleString()` จะทำให้แอปพังทั้งหน้า (White Screen of Death)      

**✅ Best Practice:**
1.  **Optional Chaining ทุกครั้ง:** ใช้ `?.` เมื่อเข้าถึง Property ของ Array หรือ Object จาก API
2.  **Fallback Values:** ใส่ค่าเริ่มต้นเสมอ เช่น `|| []` หรือ `|| 0`
3.  **Safe Formatting:** ห้ามเรียก `.toLocaleString()` สุ่มสี่สุ่มห้า ให้ครอบด้วยวงเล็บและใส่ fallback

```javascript
// ✅ Good: ปลอดภัย 100%
const total = data?.reduce((s, i) => s + (i.val || 0), 0) || 0;
return <div>{total?.toLocaleString() || 0}</div>;
```

---

## 🚀 2. Aggregate API Pattern (Parallel Fetching)
**ปัญหา:** หน้า Dashboard มักต้องยิง API หลายเส้น (Summary, Chart, Orders) ถ้าแยกยิงทีละอันจะทำให้หน้าจอกระตุก

**✅ Best Practice:**
ใช้ `Promise.all` ห่อหุ้ม API ทั้งหมด แล้วส่งให้จัดการเพียงครั้งเดียว เพื่อความต่อเนื่องของ Loading State

---

## 📦 3. Stable Library Management (React 19 & Version Locking)
**ปัญหา:** การอัปเดต React (v19+) อาจทำให้ Library เดิม Crash (เช่น `findDOMNode` Error ใน React Quill)

**✅ Best Practice:**
1.  **React 19 Compatibility:** มองหา "Maintained Forks" (เช่น `react-quill-new`) ที่รองรับ React 19
2.  **Research Stability:** ตรวจสอบความเข้ากันได้ก่อนติดตั้ง และระบุเวอร์ชันเจาะจงใน `npm install`
3.  **Legacy Peer Deps:** ใช้ `--legacy-peer-deps` เฉพาะเมื่อจำเป็นจริงๆ เพื่อข้ามการเช็คเวอร์ชันที่เข้มงวด

---

## 📡 4. Cold-Start API Resilience (Timeout Strategy)
**ปัญหา:** เซิร์ฟเวอร์ฟรี (เช่น Render) จะ Cold Start เมื่อไม่มีคนใช้ หากตั้ง Timeout สั้นไป จะขึ้น Error ก่อนเซิร์ฟเวอร์ตื่น

**✅ Best Practice:**
- **Extended Timeout:** ปรับค่า `timeout` ใน `apiClient.js` เป็น **60 วินาที** สำหรับสภาพแวดล้อม Production
- **User Feedback:** ใช้ Skeleton UI เพื่อไม่ให้ผู้ใช้รู้สึกว่าเว็บค้างระหว่างรอ

---

## 🦴 5. Visual Continuity Pattern (Skeleton UI)
**ปัญหา:** การใช้ Spinner หมุนๆ ทำให้ผู้ใช้รู้สึกว่ารอนาน

**✅ Best Practice:**
สร้าง **Skeleton Component** ที่มีเลย์เอาต์ใกล้เคียงหน้าจอจริง และใช้ Animation แบบ **Pulse** เพื่อรักษาความต่อเนื่องทางสายตา

---

## 🛡️ 6. Database Integrity Patterns (Master Skills)
1. **Atomic Stock Update:** ใช้คำสั่ง MongoDB `$inc` เพื่อป้องกันสต็อกติดลบเมื่อมีการสั่งซื้อพร้อมกันจำนวนมาก
2. **Automatic Cleanup Pattern:** มีระบบคืนสต็อกอัตโนมัติสำหรับออเดอร์ที่ `pending` นานเกินกำหนด
3. **Order State Machine:** กำหนดทิศทางการเปลี่ยนสถานะออเดอร์ให้ชัดเจน ห้ามเปลี่ยนสถานะที่ยกเลิกไปแล้วกลับมาใหม่ได้

---

## 📂 7. Portable Backend Blueprints
**✅ Best Practice:**
Frontend ควรเขียน **Blueprint** (Endpoints, Expected JSON, Aggregation Logic) เป็นไฟล์ `.md` เพื่อให้ Backend ทำงานตามแผนได้ถูกต้อง 100% ลดการแก้ไขงานซ้ำซ้อน

---

## 📊 8. Dynamic Dashboard & Chart Resilience Pattern
**ปัญหา:** การใช้ฟิลเตอร์ช่วงเวลา (Today, Week, Month) มักทำให้ข้อมูลไม่ Sync หรือกราฟพัง

**✅ Best Practice:**
1. **Chart Data Casting:** ครอบ `Number()` เสมอเมื่อนำข้อมูลลงกราฟ ป้องกันกรณี Backend ส่งมาเป็น String
2. **Safe Y-Axis Scaling:** ตั้งค่า `min` ของแกน Y ให้ยืดหยุ่น ป้องกันเส้นกราฟแบนราบเมื่อข้อมูลมีค่าเดียว
3. **Dummy Start Point:** หากข้อมูลมีจุดเดียว ให้ Backend แนบจุดเริ่มต้น (0) มาด้วยเพื่อให้กราฟลากเส้นได้
4. **Strict Grouping:** จัดกลุ่มวันที่ให้สัมพันธ์กับช่วงเวลาเสมอ (Today = รายชั่วโมง, Year = รายเดือน)

---

## 🛠️ 9. Advanced Admin Product Management (Surgical PATCH Protocol)
**ปัญหา:** การแก้ไขข้อมูลบางส่วนมักติด Validation ฟิลด์อื่น หรือเกิด Error 500

**✅ Best Practice:**
1. **Surgical Update ($set):** ใช้ `findByIdAndUpdate` พร้อม `$set` แทนการใช้ `save()` เพื่อป้องกัน Default Values ทำงานผิดพลาด
2. **Context Query:** ใส่ `context: 'query'` เมื่อใช้ `runValidators: true` เพื่อให้ตรวจเฉพาะฟิลด์ที่ส่งมา
3. **FormData Casting:** แปลงค่าจาก FormData เป็นประเภทที่ถูกต้อง (Number, Boolean) ที่ฝั่ง Backend เสมอ
4. **Media Lifecycle:** ลบรูปเก่าออกจาก Cloudinary ทันทีเมื่อมีการอัปโหลดรูปใหม่ทับ

---

## 🧱 10. System-wide Constants Sync
**✅ Best Practice:**
ใช้ไฟล์ Centralized Constants (`shared/constants/index.js`) แทนการ Hardcode String เพื่อลดบั๊ก Typo และทำให้การแก้ไขสถานะทำได้จากจุดเดียว

---

## 📎 11. Automatic Multipart Boundary
**ปัญหา:** การตั้ง `Content-Type` เองใน Axios เมื่อส่ง FormData มักทำให้การอัปโหลดรูปพัง

**✅ Best Practice:**
**ห้ามตั้ง Content-Type เอง** ปล่อยให้ Browser และ Axios จัดการ Boundary อัตโนมัติ เพื่อความแม่นยำในการส่งไฟล์

---
*Updated: 2026-06-15 | สำหรับทีม Jamine ที่เน้นคุณภาพระดับสูงสุด*
