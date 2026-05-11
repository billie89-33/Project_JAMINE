import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const desktopContainerRef = useRef(null);
  const navigate = useNavigate();

  // 📦 Mock Data สินค้าสำหรับใช้พัฒนาต่อ
  const mockProducts = [
    { id: 1, name: "Asus ROG Gaming Notebook", price: "35,900 บาท", cat: "notebook", img: "💻" },
    { id: 2, name: "MacBook Air M3 13-inch", price: "39,900 บาท", cat: "notebook", img: "💻" },
    { id: 3, name: "Custom Desktop PC i7", price: "28,500 บาท", cat: "computer", img: "🖥️" },
    { id: 4, name: "LG UltraGear 27\" Monitor", price: "8,900 บาท", cat: "monitor", img: "📺" },
    { id: 5, name: "Mechanical Keyboard Blue Switch", price: "1,590 บาท", cat: "keyboard", img: "⌨️" },
  ];

  // ระบบค้นหาข้อมูลกรองตามพิมพ์
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchQuery]);

  // ปิดดรอปดาวน์จอคอมเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopContainerRef.current && !desktopContainerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setIsMobileSearchOpen(false);
    setIsFocused(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setIsMobileSearchOpen(false);
    setIsFocused(false);
  };

  // ชิ้นส่วนการแสดงผลสินค้าในดรอปดาวน์
  const SuggestionList = () => (
    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
      {suggestions.length > 0 ? (
        suggestions.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors border border-transparent hover:border-purple-100"
          >
            <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-base border border-slate-200/60 shadow-sm flex-shrink-0">
              {product.img}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-slate-800 truncate">{product.name}</h4>
              <p className="text-[10px] text-purple-600 font-extrabold mt-0.5">{product.price}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-xs text-slate-400">
          ไม่พบสินค้าที่ตรงกับคำค้นหา 🔍
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 💻 1. ส่วนจอคอมพิวเตอร์ (Desktop View) */}
      <div ref={desktopContainerRef} className="hidden md:block relative flex-1 max-w-md mx-8">
        <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full">
          <input
            type="text"
            placeholder="ค้นหาสินค้าที่ต้องการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full bg-purple-800 text-purple-100 placeholder-purple-300 text-xs px-3.5 py-1.5 pr-9 rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400 focus:bg-purple-900 transition-all shadow-inner"
          />
          <button type="submit" className="absolute right-3 text-purple-300 hover:text-white transition-colors">
            <svg xmlns="w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
          </button>
        </form>

        {isFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-9 left-0 w-full bg-white rounded-xl shadow-2xl border border-purple-100 p-2.5 text-slate-700 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider mb-2 px-1">ผลลัพธ์การค้นหาแนะนำ</p>
            <SuggestionList />
          </div>
        )}
      </div>

      {/* 📱 2. ส่วนจอมือถือ (Mobile Full-Width Overlay) */}
      {isMobileSearchOpen && (
        /* ✨ แก้บั๊ก: บังคับใช้ h-full วิ่งเต็มขนาด Navbar และยกระดับ z-index สูงสุด (z-[110]) เพื่อล็อกไม่ให้ปุ่มโปรไฟล์ด้านหลังโผล่มาทับเลเยอร์ */
        <div className="absolute inset-0 bg-purple-700 px-4 h-full flex flex-col justify-center z-[110] animate-in fade-in slide-in-from-top duration-150">
          <div className="flex items-center gap-3 w-full">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative">
              <input
                type="text"
                autoFocus
                placeholder="พิมพ์ชื่อสินค้าเพื่อค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-purple-800 text-white placeholder-purple-300 text-xs px-3.5 py-1.5 pr-9 rounded-lg border border-purple-500 focus:outline-none"
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
              /* ✨ ใช้คลาส relative z-[120] ป้องกันปุ่มโดนเลเยอร์กล่องผลลัพธ์สินค้าด้านล่างมาเบียดทับรัศมีการคลิก */
              className="text-xs text-purple-200 font-bold px-1 py-2 hover:text-white whitespace-nowrap transition-colors relative z-[120]"
            >
              ยกเลิก
            </button>
          </div>

          {/* 📱 ดรอปดาวน์แสดงผลบนมือถือ */}
          {searchQuery.trim().length > 0 && (
            /* ✨ แก้บั๊ก: ปรับระยะลงมาเป็น top-12 เพื่อให้กล่องสินค้าลอยพ้นแถบพิมพ์พิมพ์ และไม่ไปบังปุ่ม "ยกเลิก" ด้านบน */
            <div className="absolute top-12 inset-x-0 mx-4 bg-white rounded-xl shadow-2xl border border-slate-100 p-3 text-slate-700 z-[115] max-h-[65vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider mb-2">ผลลัพธ์การค้นหาแนะนำ</p>
              <SuggestionList />
            </div>
          )}
        </div>
      )}
    </>
  );
};

/* 📱 3. ปุ่มไอคอนแว่นขยายสำหรับพ่วงไปฝั่งขวาบนมือ */
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