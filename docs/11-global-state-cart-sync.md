# 🧠 11. Global State Orchestration & Cart Sync

เอกสารนี้สรุประบบการจัดการ State ระดับ Global และแนวทางปฏิบัติที่ดีที่สุด (Best Practices) เพื่อให้ข้อมูลซิงค์กันทั้งแอปพลิเคชัน

---

## 🌐 1. หลักการแหล่งข้อมูลหนึ่งเดียว (Single Source of Truth)
เราใช้ **React Context API** (`CartContext.jsx`) เป็นศูนย์กลางในการถือครองสถานะของตะกร้าสินค้า เพื่อให้ทุกส่วนของเว็บ (Navbar, Cart Drawer, Home, Product Detail) เห็นข้อมูลชุดเดียวกันเสมอ

### ✅ ข้อดีและมาตรฐาน:
1. **Real-time Sync:** เมื่อมีการเพิ่มสินค้า ข้อมูลทุกจุดจะอัปเดตทันทีโดยไม่ต้องรีเฟรชหน้าเว็บ
2. **Efficiency:** ลดการยิง API ซ้ำซ้อน โดยการดึงข้อมูลครั้งเดียวและแชร์ผ่าน Context
3. **Reactive UI:** คอมโพเนนต์ที่ใช้ `useCart()` จะ Re-render อัตโนมัติเมื่อสถานะเปลี่ยน

---

## 🌟 2. แนวทางปฏิบัติที่ดีที่สุด (Best Practices)

1. **Modular Proxy Hook:** อย่าเรียกใช้ Context ตรงๆ ในหน้า UI ให้เรียกผ่าน Custom Hook ของโมดูล (เช่น `import { useCart } from '@/modules/cart'`) เพื่อรักษาโครงสร้าง Modular    
2. **Trust the Backend:** ห้ามคำนวณราคารวม (Total) ที่ Frontend ให้ใช้ค่าที่คำนวณจาก Backend เสมอเพื่อความแม่นยำสูงสุด (อ้างอิงเอกสารบทที่ 12)
3. **Centralized Logic:** การจัดการ Logic การเพิ่ม/ลด/ลบ สินค้า ควรจบที่เดียวใน `CartContext` เพื่อให้ UI เป็นเพียงตัวแสดงผล (Dumb Component)
4. **Action Feedback:** ทุกครั้งที่มีการเปลี่ยนแปลง (Add/Remove) ต้องมี Visual Feedback เช่น Toast Notification (`react-hot-toast`)
5. **Auth-State Sync:** ข้อมูลตะกร้าต้องถูกล้างหรือดึงใหม่ทุกครั้งที่สถานะการล็อกอินเปลี่ยน (`useEffect` ผูกกับ `user`)

---

## 💎 3. ปรัชญา "Cart as the Last Stand" (UX Recovery)
**กฎเหล็ก:** ห้ามลบข้อมูลในตะกร้าสินค้าจนกว่าเงินจะเข้าจริง!

### ทำไมถึงเป็นแนวทางที่ดีที่สุด?
*   **UX Recovery:** หากระบบจ่ายเงินค้าง หรือลูกค้าเปลี่ยนใจกลางคัน เมื่อกลับมาที่ตะกร้า **"ของต้องยังอยู่ครบ"** ไม่ใช่หายไปจนต้องเริ่มใหม่
*   **Conversion Rate:** ลดแรงต้าน (Friction) ในการซื้อซ้ำหรือแก้ไขออเดอร์ ทำให้ปิดการขายได้ง่ายขึ้น

---

## 🔒 4. Double-Lock Cart Clearing (ระบบล้างตะกร้าสองชั้น)
เพื่อให้ชัวร์ 100% ว่าตะกร้าจะถูกล้างเมื่อจ่ายเงินสำเร็จจริง เราใช้ระบบล้าง 2 ชั้น:
1.  **Lock ชั้นที่ 1 (Backend-Driven):** เมื่อ API อัปเดตสถานะออเดอร์เป็น `paid` สำเร็จ ให้ Backend สั่งลบตะกร้าทันทีใน Logic เดียวกัน
2.  **Lock ชั้นที่ 2 (Frontend-Driven):** เมื่อหน้าบ้านได้รับ Response ว่าจ่ายเงินสำเร็จ ก่อนจะ Navigate ไปหน้า Success ให้ยิง API `DELETE /cart/clear` ซ้ำอีกรอบเพื่อความปลอดภัย (Double Check)

---

## ⚠️ 5. สิ่งที่ต้องระวัง (Precautions)

1. **Auth Check First:** ต้องตรวจสอบสถานะ User ก่อนเรียกใช้ฟังก์ชัน `addToCart` หากยังไม่ล็อกอินให้แจ้งเตือนและหยุดการทำงานทันที
2. **Loading States:** ระหว่างรอดึงข้อมูลจาก API ต้องมี Loading State หรือปิดการทำงานของปุ่มชั่วคราว เพื่อป้องกันการกดซ้ำ (Double Submission)
3. **Stock Adjustment:** ตรวจสอบฟิลด์ `isStockAdjusted` จาก API Response เสมอ หากหลังบ้านมีการปรับจำนวนสินค้าตามสต็อกจริง ต้องแจ้งเตือนผู้ใช้ให้ทราบด้วย Toast สีที่ชัดเจน
4. **Race Conditions & UI Flickering:** การกดยิง API หลายครั้งพร้อมกัน (เช่น กดย้ำๆ ที่ปุ่มเพิ่มจำนวน) ห้ามใช้แค่สถานะ `loading` บล็อกหน้าจอ (เพราะจะทำให้ผู้ใช้รู้สึกเว็บหน่วง 1,100+ ms) ให้ใช้สถาปัตยกรรม **Optimistic Debounced Sync** (ดูรายละเอียดในหัวข้อที่ 6)
5. **No Local Storage for Prices:** ห้ามใช้ LocalStorage ในการเก็บราคาหรือส่วนลดเพื่อนำมาคำนวณยอดชำระเงินเด็ดขาด ให้ใช้ข้อมูลสดใหม่จาก API เท่านั้น

---

## ⚡ 6. สถาปัตยกรรม Optimistic Debounced Sync & Pending Updates Guard (Advanced Real-time Pattern)

เพื่อแก้ปัญหาผู้ใช้กดปุ่มเพิ่ม/ลดสินค้าแล้วเว็บหน่วง (ใช้เวลาไป-กลับเน็ตเวิร์ก 1,100+ ms) และป้องกันปัญหาเลขกะพริบย้อนหลังเมื่อกดรัวๆ (Race Condition) เราใช้การผสาน 3 เทคนิคขั้นสูง (The Ultimate Trifecta) ใน `CartContext.jsx`:

### 👑 กลไกการทำงานทั้ง 3 ขั้นตอน
1. **⚡ Optimistic UI Update (Instant Feedback 0.01s):** อัปเดต `cartItems` และคำนวณราคาสรุปชั่วคราวบนหน้าจอทันที เพื่อให้ผู้ใช้รู้สึกว่าเว็บลื่นไหลและตอบสนองเร็วติดนิ้ว
2. **⏳ Debounced API Synchronization (ลด Traffic 80%):** ใช้ `setTimeout` หน่วงเวลา 500ms รอให้ผู้ใช้หยุดกดรัวๆ แล้วจึงรวบยอดตัวเลขล่าสุดส่งให้ Backend เพียง **ครั้งเดียว**
3. **🛡️ Pending Updates Guard (ป้องกันเลขกะพริบ 100%):** ใช้ `pendingUpdates.current[productId]` นับจำนวนคิวที่ค้างอยู่ หาก API ตอบกลับมาแต่ยังมีคิวกดใหม่รออยู่ (`pendingUpdates > 0`) ระบบจะเพิกเฉยข้อมูลเก่าทันที เพื่อไม่ให้สวมทับหน้าจอจนเกิดอาการเลขกะพริบ

### ✅ โครงสร้างโค้ดมาตรฐาน (Implementation Blueprint)
```javascript
// 1. ประกาศ useRef สำหรับเก็บ Timer และ Guard
const debounceTimers = useRef({});
const pendingUpdates = useRef({});

// 2. ฟังก์ชันอัปเดตจำนวน
const updateQuantity = async (productId, quantity) => {
  if (!productId) return;
  if (quantity < 1) return removeItem(productId);

  // ⚡ เทคนิคที่ 1: Optimistic UI Update (เปลี่ยน State ทันที)
  setCartItems(prevItems => prevItems.map(item => 
    item.id === productId ? { ...item, quantity } : item
  ));
  // (คำนวณ setSummary ชั่วคราวให้สอดคล้อง)

  // ⏳ เทคนิคที่ 2: Debounce Timer 500ms
  if (debounceTimers.current[productId]) {
    clearTimeout(debounceTimers.current[productId]);
    debounceTimers.current[productId] = null;
    pendingUpdates.current[productId] -= 1; // ยกเลิกคิวเก่า
  }

  pendingUpdates.current[productId] = (pendingUpdates.current[productId] || 0) + 1;

  debounceTimers.current[productId] = setTimeout(async () => {
    debounceTimers.current[productId] = null;
    try {
      const res = await updateCartQuantityApi(productId, quantity);
      pendingUpdates.current[productId] -= 1;
      
      // 🛡️ เทคนิคที่ 3: The Guard เช็คว่าไม่มีใครกดแทรก ค่อยทับ State
      if (pendingUpdates.current[productId] === 0) {
        syncCartState(res);
      }
    } catch (error) {
      pendingUpdates.current[productId] -= 1;
      if (pendingUpdates.current[productId] === 0) {
        fetchCart(); // Fallback ดึงข้อมูลใหม่
      }
    }
  }, 500);
};
```

---
*อัปเดตมาตรฐานสถาปัตยกรรม Optimistic Debounced Sync และการป้องกัน Race Condition - 2026-06-26 (V3.0 Advanced Pattern)*
