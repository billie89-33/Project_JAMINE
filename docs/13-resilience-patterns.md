# 🛡️ 13. High-Resilience Patterns (Stable & Scalable)

เอกสารชุดนี้สรุป "บทเรียนราคาแพง" และ "Best Practices" จากการพัฒนา Admin Dashboard เพื่อเป็นมาตรฐานในการสร้างระบบที่เสถียร (Stable) และยืดหยุ่นพอที่จะนำไปใช้กับโปรเจกต์อื่นได้ทันที

---

## 🛑 1. Defensive Rendering Pattern (กันหน้าจอขาว)
**ปัญหา:** เมื่อ API ส่งข้อมูลล่าช้า หรือส่งข้อมูลมาไม่ครบ (null/undefined) การเรียกใช้ `.map()`, `.reduce()` หรือ `.toLocaleString()` จะทำให้แอปพังทั้งหน้า (White Screen of Death)

**✅ Best Practice:**
1.  **Optional Chaining ทุกครั้ง:** ใช้ `?.` เมื่อเข้าถึง Property ของ Array หรือ Object จาก API
2.  **Fallback Values:** ใส่ค่าเริ่มต้นเสมอ เช่น `|| []` หรือ `|| 0`
3.  **Safe Formatting:** ห้ามเรียก `.toLocaleString()` สุ่มสี่สุ่มห้า ให้ครอบด้วยวงเล็บและใส่ fallback

```javascript
// ❌ Bad: พังแน่นอนถ้า data เป็น undefined
const total = data.reduce((s, i) => s + i.val, 0);
return <div>{total.toLocaleString()}</div>;

// ✅ Good: ปลอดภัย 100%
const total = data?.reduce((s, i) => s + (i.val || 0), 0) || 0;
return <div>{total?.toLocaleString() || 0}</div>;
```

---

## 🚀 2. Aggregate API Pattern (Parallel Fetching)
**ปัญหา:** หน้า Dashboard มักต้องยิง API หลายเส้น (Summary, Chart, Orders) ถ้าแยกยิงทีละอันจะทำให้ `isLoading` สลับไปมาและหน้าจอกระตุก

**✅ Best Practice:**
สร้างฟังก์ชัน `fetchAll...` ที่ใช้ `Promise.all` ห่อหุ้ม API ทั้งหมด แล้วส่งให้ `useApi` จัดการเพียงครั้งเดียว

```javascript
const fetchAllData = useCallback(async (params) => {
    const [res1, res2] = await Promise.all([getApi1(params), getres2(params)]);
    return { data1: res1.data, data2: res2.data };
}, []);

const { loading, data, execute } = useApi(fetchAllData);
```

---

## 📦 3. Stable Library Management (Version Locking)
**ปัญหา:** การติดตั้ง Library เวอร์ชันล่าสุด (Latest) เสมออาจเจอบัคที่ยังไม่ได้รับการแก้ไข (เช่น Recharts v3 กับ React 19)

**✅ Best Practice:**
1.  **Research Stability:** ตรวจสอบ Compatibility ของ Library กับเวอร์ชัน React/Vite ก่อนติดตั้ง
2.  **Fixed Versioning:** หากเจอเวอร์ชันที่เสถียร (Stable) ให้ระบุเวอร์ชันเจาะจงใน `npm install` (เช่น `@2.12.7`)
3.  **Legacy Peer Deps:** หากใช้ React เวอร์ชันใหม่ล่าสุด (v19+) แล้ว Library ยังไม่อัปเดต ให้ใช้แฟล็ก `--legacy-peer-deps` เพื่อข้ามการเช็คเวอร์ชันที่เข้มงวดเกินไป

---

## 🦴 4. Visual Continuity Pattern (Skeleton UI)
**ปัญหา:** การใช้ Spinner หมุนๆ กลางหน้าจอทำให้ผู้ใช้รู้สึกว่ารอนานและเสียความต่อเนื่องทางสายตา

**✅ Best Practice:**
สร้าง **Skeleton Component** ที่มีโครงสร้าง (Layout) ใกล้เคียงกับหน้าจอจริง และใช้ Animation แบบ **Pulse** เพื่อให้ความรู้สึกว่าแอป "กำลังเตรียมข้อมูล" ไม่ใช่ "ค้าง"

---

## 🏗️ 5. Database Integrity Patterns (Master Skills)
เพื่อความเสถียรของข้อมูลในระดับ Database (Backend Focused):

1. **Atomic Stock Update:** ห้ามใช้ Read-Modify-Write (ดึงมาแก้แล้วเซฟ) ให้ใช้คำสั่ง SQL หรือ MongoDB `$inc` ที่มีเงื่อนไขตรวจสอบสต็อกในตัวเดียว (Atomic) เพื่อป้องกันสต็อกติดลบเมื่อมีการสั่งซื้อพร้อมกันจำนวนมาก
2. **Automatic Cleanup Pattern:** ป้องกันการ "จองกั๊ก" สินค้า โดยมีระบบคืนสต็อกอัตโนมัติสำหรับออเดอร์ที่ค้าง `pending` นานเกินเวลาที่กำหนด (เช่น 30 นาที) ผ่าน Cron Job หรือ On-demand Check
3. **Order State Machine:** กำหนดทิศทางการเปลี่ยนสถานะออเดอร์ให้ชัดเจน (Valid Transitions) เช่น `pending` -> `paid` เท่านั้น ห้ามข้ามขั้นหรือเปลี่ยนสถานะที่ยกเลิกไปแล้วกลับมาจ่ายเงินได้อีก

---

## 📂 6. Portable Backend Blueprints
**ปัญหา:** Frontend มักต้องรอ Backend ทำ API เสร็จถึงจะเริ่มงานได้ หรือทำเสร็จแล้ว Data Format ไม่ตรงกัน

**✅ Best Practice:**
Frontend ควรสรุป **"Blueprint"** (Models, Controllers, Routes) ออกมาเป็นไฟล์ `.md` เพียงไฟล์เดียวที่ระบุ:
1.  **Endpoints & Params**
2.  **Expected JSON Response** (ต้องมี `success: true` และ `data: ...`)
3.  **Sample Aggregation Logic** (ถ้าเป็นสถิติ)
สิ่งนี้จะช่วยให้ Backend ทำงานง่ายขึ้น 100% และลดการแก้ไขงานซ้ำซ้อน

---

## 📊 7. Dynamic Dashboard & Chart Resilience Pattern
**ปัญหา:** การสร้าง Dashboard ที่มี Filter (เช่น Today, Week, Month, Year) มักมีปัญหาการสื่อสารระหว่าง Frontend กับ Backend ทำให้ข้อมูลไม่ Sync กัน กราฟหาย หรือตัวเลขยอดรวมไม่เปลี่ยนตามช่วงเวลา

**✅ Best Practice (สิ่งที่ต้องทำ):**
1. **Dynamic Metrics Sync (ทุกอย่างต้องเปลี่ยนตาม):** เมื่อมีการปรับ Period Filter ข้อมูลสรุป (Summary), กราฟ (Charts), และรายการ (Lists) **ทุกส่วนบนหน้าจอจะต้องเปลี่ยนเพื่อสะท้อนข้อมูลในช่วงเวลานั้นๆ เท่านั้น** ห้ามนำยอด All Time มาปะปนโดยไม่ระบุให้ชัดเจน
2. **Chart Data Type Casting (Frontend):** ตัววาดกราฟเช่น ApexCharts เข้มงวดเรื่อง Data Type มาก ให้ครอบ `Number()` เสมอก่อนนำข้อมูลลง series เพื่อป้องกันกราฟหายหาก Backend ส่งมาเป็น String
3. **Safe Y-Axis Scaling (Frontend):** ตั้งค่าแกน Y ให้ยืดหยุ่น (Dynamic Scaling) แบบปลอดภัย เช่น `min: (val) => (typeof val === 'number' && !isNaN(val) && val > 1000) ? val * 0.98 : 0` เพื่อให้เส้นกราฟไม่แบนราบและป้องกัน Error เมื่อข้อมูลเป็น 0
4. **Dummy Start Point (Backend):** หากข้อมูลหลังจากการ Query ตามช่วงเวลาได้ผลลัพธ์เพียง 1 จุด (เช่น มีออเดอร์แค่วันเดียว) ให้ Backend แนบ "จุดเริ่มต้นจำลอง" (เช่น `{ date: 'Start', revenue: 0 }`) มาให้ด้วยเสมอ เพื่อให้ไลบรารีกราฟเส้นสามารถตีเส้นเชื่อมจุดได้
5. **Safe Date Range Generation (Backend):** ห้าม Mutate ตัวแปร Date ต้นฉบับ (เช่น `new Date(now).setDate(...)`) หากมีการทำงานแบบ Async หรือ `Promise.all` หลายเส้นพร้อมกัน เพราะจะทำให้ตัวแปร Date ตีกันมั่ว ให้สร้าง `new Date()` ใหม่เสมอในแต่ละช่วงเวลา
6. **Strict Grouping Format (Backend):** การรวมกลุ่มวันที่ (Group By) ต้องสัมพันธ์กับช่วงเวลา:
   - `today`: จัดกลุ่มตามชั่วโมง (`%H:00`)
   - `week` / `month`: จัดกลุ่มตามวัน (`%Y-%m-%d`)
   - `year`: จัดกลุ่มตามเดือน (`%Y-%m`)

**❌ สิ่งที่ห้ามทำ (Anti-Patterns):**
- **ห้ามคิวรี่ข้าม Scope:** ห้ามดึงข้อมูล All Time มาเผื่อไว้คำนวณที่ Frontend เด็ดขาด เพราะจะเปลือง Memory ให้ Backend ส่งมาเฉพาะข้อมูลตาม Range ที่ Filter แล้วเท่านั้น
- **ห้ามใช้ Key สุ่มสี่สุ่มห้า:** หากข้อมูลกราฟหาย ให้ตรวจเช็ค Network Tab เป็นหลัก อย่าเพิ่งแก้โค้ดกราฟ (เช่น หน้าบ้านรอรับ `revenueData` แต่ Backend ส่ง `revenueChart`)

---
*Generated by Gemini CLI - สำหรับนักพัฒนาที่เน้นคุณภาพและความเสถียร*