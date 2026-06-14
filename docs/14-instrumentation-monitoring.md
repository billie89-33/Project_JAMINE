# 📊 14. Instrumentation & Performance Monitoring

คู่มือการติดตั้งระบบตรวจสอบประสิทธิภาพ (Instrumentation) และเทคนิคการวิเคราะห์บัคระดับลึก (Deep Debugging) เพื่อรักษาความเร็วและความเสถียรของระบบ

---

## ⏱️ 1. ระบบวัดเวลา API (API Timing Interceptor)
เราใช้ Axios Interceptors ในการจับเวลาทุก Request เพื่อหาจุดคอขวด (Bottleneck) ทั้งในฝั่ง Network และ Backend

### ✅ รูปแบบมาตรฐาน (Implementation)
ในไฟล์ `apiClient.js`:
```javascript
apiClient.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date() };
    console.log(`🚀 [API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        const duration = new Date() - response.config.metadata.startTime;
        console.log(`✅ [API Response] ${response.config.url} - ${duration}ms`);
        return response;
    },
    (error) => {
        if (error.config?.metadata) {
            const duration = new Date() - error.config.metadata.startTime;
            console.error(`❌ [API Error] ${error.config.url} - ${duration}ms`);
        }
        return Promise.reject(error);
    }
);
```

### 💡 ประโยชน์:
- **Cold Start Detection:** ตรวจสอบว่า Backend ช้าเพราะเริ่มระบบใหม่ (Cold Start) หรือไม่
- **Network Latency:** แยกแยะระหว่าง "เน็ตช้า" กับ "โค้ดช้า"
- **User Trust:** ให้ข้อมูลความเร็วที่เป็นตัวเลขจริง แทนการคาดเดา

---

## 🔍 2. เทคนิคการวิเคราะห์บัคระดับลึก (Deep Debugging Discipline)

เมื่อเกิดปัญหา "ค้าง" หรือ "เงียบ" (Silent Fail) ให้ใช้ลำดับขั้นตอนดังนี้:

### 1️⃣ Trace the Callback Chain
- ตรวจสอบว่า Hook ที่ใช้ (เช่น `useApi`) ส่งค่า Argument อะไรออกมาบ้าง
- **บัคที่พบบ่อย:** เข้าใจผิดว่า Argument ตัวแรกคือ Response ทั้งหมด (จริงๆ อาจเป็นแค่ Data ที่ถูก Transform แล้ว)
- **วิธีแก้:** ใส่ `console.log` ที่ Callback เพื่อดูโครงสร้างข้อมูลจริงก่อนเขียน Logic

### 2️⃣ Silent Fail Prevention
- หากหน้าจอค้างโดยไม่เปลี่ยนหน้า ให้ตรวจสอบเงื่อนไข `if` ใน `onSuccess` หรือ `useEffect`
- ตรวจสอบว่ามีเคส `else` หรือ `catch` ที่ครอบคลุมทุกความผิดพลาดหรือไม่

### 3️⃣ Resource Monitoring
- ใช้ Chrome DevTools > Network ในการดูว่ามี Request ที่สถานะเป็น `(pending)` ค้างไว้นานเกินไปหรือไม่
- ตรวจสอบ `timeout` ใน `apiClient.js` ว่าเหมาะสมกับสภาพเน็ตเวิร์กหรือไม่

---

## 🛠️ 3. มาตรฐานการ Log (Logging Standards)
- **Development:** ใช้ `console.log` พร้อม Emoji เพื่อให้สังเกตง่าย (🚀, ✅, ❌)
- **Production:** ควรมีระบบจัดการ Log หรือปิดการแสดงผล Log ที่เป็นความลับ

---
*บันทึกเทคนิคจากเคส Login Hang - 2026-06-05*
