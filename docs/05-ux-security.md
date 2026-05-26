# 🛡️ 05. UX, Security & Safety

ความปลอดภัยของระบบและความพึงพอใจของผู้ใช้คือหัวใจสำคัญ

## 🔐 Security & Data
- **SPA Navigation**: ใช้ `<Link>` หรือ `<NavLink>` แทน `<a>` เพื่อป้องกันหน้ากระตุก
- **Scope Integrity**: เมื่อ Refactor ต้องเช็คการประกาศ `useNavigate`, `useAuth` ในไฟล์ใหม่เสมอ
- **Syntax Check (Safety Cut)**: ตรวจสอบปีกกา `{}` ปิดฟังก์ชัน (ป้องกันหน้าขาว)

## ✨ User Experience (UX)
- **Toast Notifications**: ใช้ `react-hot-toast` (success/error) ทุกครั้งที่มีการติดต่อ API
- **Loading UI**: ต้องมี Skeleton หรือ Spinner ระหว่างรอข้อมูล
- **Error Boundaries**: จัดการกรณี API พังไม่ให้หน้าเว็บล่มทั้งหน้า

## 💡 Pro-Tips
1. **Check the Index**: เพิ่มไฟล์ใหม่ อย่าลืมลงทะเบียนใน `index.js`
2. **Brace Integrity**: หากหน้าจอขาว ให้เช็คปีกกาปิดเป็นอันดับแรก
3. **Data Centralization**: แก้ไขที่จุดเดียว ข้อมูลเปลี่ยนทั้งเว็บ
