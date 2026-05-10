import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ นำเข้า useNavigate เพื่อส่งหน้าไปค้นหาจริง

const SearchBar = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ตัวนำทางเปลี่ยนหน้าของ React Router

  // 🌐 ฟังก์ชันสำหรับจัดการส่งข้อมูลไปค้นหา (รองรับการผูก API อนาคต)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลเพื่อไม่ให้ส่งค่าว่าง
    if (!searchQuery.trim()) return;

    // 🚀 [แนวทางอนาคต]: เปลี่ยนหน้าส่งข้อความค้นหาผ่านระบบ URL Query Parameter
    // เช่น เปลี่ยนหน้าไปที่ /search?q=notebook เพื่อให้หน้านั้นไปดึงข้อมูลจาก API เอง
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

    // เคลียร์ค่าและปิดหน้าต่างค้นหาบนมือถือหลังกดส่งเรียบร้อย
    setSearchQuery(""); 
    setIsMobileSearchOpen(false); 
  };

  /* 
    💡 [ทิปส์เพิ่มเติมสำหรับอนาคตตอนเชื่อม API จริง]:
    หากต้องการทำระบบ "พิมพ์แล้วขึ้นแนะนำคำค้นหาด้านล่างทันที (Auto-suggest)"
    คุณสามารถเพิ่มฟังก์ชัน useEffect ดักฟังตัวแปร searchQuery 
    แล้วใช้คำสั่ง fetch() หรือ axios.get(`/api/products/search?q=${searchQuery}`) 
    มายิงข้อมูลแบบ Real-time ตรงนี้ได้เลยครับ
  */

  return (
    <>
      {/* 💻 1. ช่อง Search บนจอคอมพิวเตอร์ (Desktop) */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="hidden md:flex items-center relative flex-1 max-w-md mx-8"
      >
        <input
          type="text"
          placeholder="ค้นหาสินค้าที่ต้องการ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-purple-800 text-purple-100 placeholder-purple-300 text-xs px-3.5 py-1.5 pr-9 rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400 focus:bg-purple-900 transition-all shadow-inner"
        />
        <button 
          type="submit" 
          className="absolute right-3 text-purple-300 hover:text-white transition-colors"
        >
          <svg xmlns="w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
          </svg>
        </button>
      </form>

      {/* 📱 2. แถบสไลด์ค้นหาบนมือถือ (Mobile Full-Width Overlay) */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 bg-purple-700 px-4 flex items-center gap-3 z-[150] animate-in fade-in slide-in-from-top duration-150">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative">
            <input
              type="text"
              autoFocus
              placeholder="พิมพ์ชื่อสินค้าเพื่อค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-purple-800 text-white placeholder-purple-300 text-xs px-3.5 py-2 pr-9 rounded-lg border border-purple-500 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 text-purple-200 hover:text-white">
              <svg xmlns="w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
              </svg>
            </button>
          </form>
          <button 
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(false);
              setSearchQuery("");
            }}
            className="text-xs text-purple-200 font-bold px-1 py-2 hover:text-white whitespace-nowrap transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      )}
    </>
  );
};

/* 📱 3. ปุ่มไอคอนแว่นขยายสำหรับพ่วงไปฝั่งขวาบนมือถือ */
export const MobileSearchButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex md:hidden p-1.5 text-purple-100 hover:text-white transition-colors"
    >
      <svg xmlns="w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
      </svg>
    </button>
  );
};

export default SearchBar;