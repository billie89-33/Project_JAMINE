# 🌎 18. Universal Enterprise Patterns & Post-Mortems

เอกสารนี้เปรียบเสมือน **"คัมภีร์รวมทักษะขั้นสูง (Skill Set)"** ที่ถูกออกแบบมาให้ **ยืดหยุ่นและนำไปใช้ได้กับทุกโปรเจกต์** (Universal Applicability) ไม่ว่าจะเป็น React, Vue, Angular หรือ Backend Framework ใดๆ

ข้อมูลในนี้เกิดจากการสรุปบทเรียน (Post-Mortem) ของบั๊กที่เจอบ่อย ข้อผิดพลาดจากความเผอเรอ และ Best Practices เพื่อป้องกันไม่ให้ประวัติศาสตร์ซ้ำรอย

---

## 🛡️ 1. Defensive Parsing & Double Stringify Prevention
**ปัญหาที่เคยพบ:** ข้อมูล JSON (เช่น สเปคสินค้า) ถูกบันทึกลง Database แต่หน้าจอแตก (Crash) เพราะข้อมูลกลายเป็น String ซ้อน String (เช่น `""{\"Color\":\"Red\"}""`) ทำให้เมื่อใช้ `Object.entries()` ระบบจึงกระจาย String ออกมาเป็นตัวเลข Index (0, 1, 2...)
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   **The Rule of Safe Parse:** ห้ามเชื่อใจข้อมูลประเภท Object/Array ที่ถูกส่งมาจาก Backend หรือ LocalStorage ว่ามันจะเป็น Object เสมอ ให้เขียน **Defensive Check** ครอบไว้ทุกครั้ง
```javascript
// ✅ Best Practice: Universal Safe Parser
let safeData = {};
if (typeof rawData === 'string') {
    try {
        safeData = JSON.parse(rawData);
        // ดักจับเคส Stringify ซ้อน 2 ชั้น
        if (typeof safeData === 'string') safeData = JSON.parse(safeData);
    } catch (e) {
        console.error("Parse error, falling back to empty object", e);
    }
} else if (rawData && typeof rawData === 'object') {
    safeData = rawData;
}
```

---

## 🔗 2. The Missing Link (Prop-Drilling Blindspot)
**ปัญหาที่เคยพบ:** สร้าง Hook ดึงข้อมูลเรียบร้อย สร้าง Component ย่อยรับ Props เรียบร้อย แต่ **"หน้าจอไม่ขึ้นข้อมูล"** เพราะลืมส่ง Props ผ่าน Component ตัวกลาง (เช่น ลืมส่ง `specFilters` จาก `CategoryPage` ไปให้ `Sidebar`)
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   **The Rule of Traceability:** เมื่อเพิ่ม State หรือตัวแปรใหม่ในระบบ ให้ใช้วิธี **"Trace End-to-End"** เสมอ
*   *เช็คลิสต์ 3 จุด (The 3-Point Check):*
    1. **Source:** Hook/API คืนค่าตัวแปรออกมาหรือยัง?
    2. **Bridge:** Page/Layout ที่เรียกใช้ Hook ได้รับและ **ส่งต่อ (Pass Down)** หรือยัง? *(จุดที่คนลืมบ่อยที่สุด)*
    3. **Destination:** Child Component รับ Props และนำไป Render ถูกต้องหรือไม่?

---

## 🌐 3. Network Boundary Serialization (Axios Array Bug)
**ปัญหาที่เคยพบ:** ฝั่งหน้าบ้านมี State เป็น Array (เช่น `['Apple', 'Samsung']`) และส่งผ่าน `axios.get(url, { params: { brand: selectedBrands } })` แต่ Backend หาข้อมูลไม่เจอ เพราะ Axios แปลง Array เป็น `brand[]=Apple&brand[]=Samsung` ซึ่ง Express/REST API มาตรฐานมักจะอ่านไม่ออกหากไม่มี Middleware เฉพาะ
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   **The Rule of Simple Serialization:** เวลาส่ง Array ผ่าน HTTP GET Parameters ให้มัดรวมเป็นก้อน String ที่คั่นด้วยลูกน้ำ (Comma-separated) เสมอ เพื่อความเข้าใจกันได้ 100% กับทุกภาษา Backend (Node, Python, Go)
```javascript
// ❌ แย่: ปล่อยให้ Axios จัดการ Array เอง
const params = { brand: ['Apple', 'Samsung'] };

// ✅ Best Practice: มัดรวมก่อนส่ง
const params = { brand: selectedBrands.join(',') }; // ผลลัพธ์: 'Apple,Samsung'
```
*   แล้วในฝั่ง Backend ค่อยใช้ `.split(',')` คืนร่างกลับมาเป็น Array

---

## 📋 4. Deterministic Rendering (Object vs Array Ordering)
**ปัญหาที่เคยพบ:** ลำดับของคุณสมบัติสเปคสินค้า สลับตำแหน่งไปมาแบบสุ่ม (Random) ทุกครั้งที่มีการบันทึกหรือโหลดหน้าเว็บใหม่
**สาเหตุ:** ใน JavaScript และ JSON มาตรฐาน การใช้ `Object.entries()` กับ Object ทั่วไป **"ไม่มีการรับประกันลำดับ (No guaranteed order)"**
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   **The Rule of Predictable UI:** ถ้าการแสดงผลบนหน้าจอ "ลำดับมีความสำคัญ" (Order matters) ห้ามใช้ Object เปล่าๆ ในการ Render เด็ดขาด
*   **ทางแก้ที่ 1 (Insertion Order Strategy):** แปลงให้เป็น Array ของ Object ตั้งแต่ตอนรับข้อมูล `[{ key: 'Color', val: 'Red' }]` เพราะ Array รับประกันลำดับ 100%
*   **ทางแก้ที่ 2 (Forced Sorting Strategy):** หากจำเป็นต้องใช้ Object.entries() ให้ทำการ `.sort()` เสมอก่อนนำไป `.map()`
```javascript
// ✅ Best Practice: บังคับเรียง A-Z เพื่อให้ UI ไม่กระโดดไปมา
Object.entries(myObject)
  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  .map(([key, value]) => { ... })
```

---

## 🎯 5. Separation of Concerns (Dumb UI & Smart Logic)
**บทเรียนความสำเร็จ:** การแยก Logic ยุ่งๆ ไว้ใน `useProducts` และ `useEditProduct` ทำให้ Component อย่าง `Sidebar` และ `ProductCard` สะอาดมาก
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   ยึดหลัก **"หน้าบ้านคือผืนผ้าใบโง่ๆ (Dumb Canvas)"**
*   ห้ามเขียน `try-catch`, `axios.get`, หรือ `JSON.parse` ยืดยาวลงในไฟล์ `.jsx` โดยตรง
*   ให้สร้าง Hook (`use...`) มาครอบเสมอ เพื่อให้ไฟล์ UI มีหน้าที่แค่รับ Props มาโชว์ และส่ง Event กลับไปเท่านั้น วิธีนี้จะทำให้คุณสามารถย้ายโค้ดไปโปรเจกต์อื่น หรือเปลี่ยนไปใช้ Next.js/React Native ได้แทบจะทันที

---

## 🛡️ 6. Database Boundary Sanitization (Unicode Substitution Pattern)
**ปัญหาที่เคยพบ:** ข้อจำกัดของฐานข้อมูล (เช่น MongoDB ห้ามใช้ `.` ในชื่อฟิลด์) ทำให้ระบบพังเมื่อผู้ใช้กรอกข้อมูลทางเทคนิคที่มีหน่วยเป็นจุด (เช่น `Display Size (in.)`)
**การนำไปประยุกต์ใช้กับทุกโปรเจกต์:**
*   **The Rule of Visual Cloaking:** หากพบข้อจำกัดของอักขระพิเศษใน DB ให้ใช้วิธี **"แทนที่ด้วยอักขระที่หน้าตาเหมือนกัน (Unicode Replacement)"** แทนการลบข้อมูลทิ้ง
*   **Best Practice:**
    - เปลี่ยน `.` เป็น `．` (Full-width Period `\uFF0E`)
    - เปลี่ยน `$` เป็น `＄` (Full-width Dollar `\uFF04`)
*   **ผลลัพธ์:** ข้อมูลปลอดภัยใน DB และ UI ยังแสดงผลสวยงามเหมือนเดิม 100% โดยไม่ต้องทำ `replace` กลับตอนดึงข้อมูล
