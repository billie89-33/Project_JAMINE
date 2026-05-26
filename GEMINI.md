# Jamine Project Rules & Best Practices 🚀

ไฟล์นี้คือ "ป้ายบอกทาง" สำหรับ Gemini CLI และทีมพัฒนา เพื่อรักษามาตรฐาน Enterprise Modular Architecture

### 📜 วิธีการใช้งานสำหรับ Gemini CLI:
ทุกครั้งที่เริ่มงานใหม่ หรือได้รับคำสั่งให้สร้างฟีเจอร์/API ให้ใช้เครื่องมือ `read_file` เพื่อศึกษาแนวทางจากโฟลเดอร์ `docs/` ตามหมวดหมู่ดังนี้:

1. **โครงสร้างโปรเจกต์ & Modules:** [docs/01-architecture.md](./docs/01-architecture.md)
   - *ใช้อ่านเมื่อ:* ต้องสร้างโฟลเดอร์ใหม่, ย้ายไฟล์, หรือวางโครงสร้าง Module
2. **กฎการเขียนโค้ด & การตั้งชื่อ:** [docs/02-coding-standards.md](./docs/02-coding-standards.md)
   - *ใช้อ่านเมื่อ:* ต้องเขียน Component ใหม่, ตรวจสอบความสะอาดของโค้ด (Lint)
3. **การจัดการ API (Master Guide):** [docs/03-api-services.md](./docs/03-api-services.md)
   - *ใช้อ่านเมื่อ:* ต้องเชื่อมต่อ Backend, จัดการ HttpOnly Cookies, หรือตั้งค่า Interceptors
4. **การจัดการ State & Context:** [docs/04-state-management.md](./docs/04-state-management.md)
   - *ใช้อ่านเมื่อ:* ต้องแชร์ข้อมูลข้ามหน้า, สร้าง Provider, หรือจัดการ Global State
5. **ความปลอดภัย & UX:** [docs/05-ux-security.md](./docs/05-ux-security.md)
   - *ใช้อ่านเมื่อ:* ต้องทำระบบ Login, จัดการเรื่องการแจ้งเตือน (Toast), หรือ Loading State
6. **การตรวจสอบระบบ & Debugging:** [docs/06-frontend-debugging.md](./docs/06-frontend-debugging.md)
   - *ใช้อ่านเมื่อ:* เจอหน้าเว็บขาว, API ยิงไม่ไป, เช็ค HttpOnly Cookies หรือใช้ React DevTools
7. **การจัดการ Event & Logic:** [docs/07-event-handling.md](./docs/07-event-handling.md)
   - *ใช้อ่านเมื่อ:* ต้องเขียนฟังก์ชัน `handle...`, แยก Logic ออกจาก UI หรือสร้าง Custom Hook ใหม่

---
*หมายเหตุ: ไฟล์นี้ถูกออกแบบมาให้เป็น Portable Brain เมื่อคุณย้ายโฟลเดอร์โปรเจกต์ไปเครื่องอื่น Gemini จะยังคงจำกฎเหล่านี้ได้ผ่านไฟล์นี้*
