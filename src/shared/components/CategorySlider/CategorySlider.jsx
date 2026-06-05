import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoriesApi } from '@/modules/products/services/productApi';
import { useApi } from '@/shared/hooks/useApi';

/**
 * 🎡 CategorySlider Component
 * ดึงรายการหมวดหมู่สินค้ามาจาก API แบบ Dynamic
 */
const CategorySlider = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // 🎣 ดึงข้อมูลหมวดหมู่จาก API
  const { data: apiCategories, loading, execute: fetchCategories } = useApi(getCategoriesApi);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 🖼️ ระบบ Mapping รูปภาพประจำหมวดหมู่ (ถ้าเพิ่มหมวดใหม่ในอนาคตแต่ไม่มีในนี้ จะใช้ Default Image)
  const categoryImages = {
    'Notebook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&auto=format&fit=crop',
    'Keyboard': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=300&auto=format&fit=crop',
    'Computer': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=300&auto=format&fit=crop',
    'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3490?q=80&w=300&auto=format&fit=crop',
    'Gaming Mouse': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3490?q=80&w=300&auto=format&fit=crop',
    'Graphics Card': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=300&auto=format&fit=crop',
    'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=300&auto=format&fit=crop',
    'CPU': 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=300&auto=format&fit=crop',
    'Mainboard': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop'
  };

  // สร้างออบเจกต์หมวดหมู่จาก API
  const categories = (apiCategories || []).map((name, index) => ({
    id: index + 1,
    name: name,
    type: name,
    image: categoryImages[name] || 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=300&auto=format&fit=crop'
  }));

  // ฟังก์ชันควบคุมการเลื่อนสไลด์ซ้าย-ขวา
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.4;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/slider">
      {/* 🏔️ Decorative Background Glow (ม่วงเรืองแสงอ่อนๆ ด้านหลัง) */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-100/30 to-indigo-100/30 blur-3xl rounded-[40px] -z-10"></div>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_50px_rgba(124,58,237,0.08)] border border-white/50 relative overflow-hidden">
        
        {/* ☄️ ส่วนหัวข้อที่ดูพรีเมียมขึ้น */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-10 h-[2px] bg-purple-600 rounded-full"></span>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Category</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/category/All')}
            className="group/btn flex items-center gap-2 px-6 py-3 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-purple-200"
          >
            View All 
            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 🖱️ ปุ่มลูกศรแบบ Overlay สไตล์ Modern */}
        <div className="absolute left-4 top-[65%] -translate-y-1/2 z-20 pointer-events-none lg:group-hover/slider:pointer-events-auto">
          <button
            onClick={() => handleScroll('left')}
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-purple-600 shadow-2xl border border-purple-50 hover:bg-purple-600 hover:text-white transition-all duration-500 opacity-0 lg:group-hover/slider:opacity-100 -translate-x-4 lg:group-hover/slider:translate-x-0 active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="absolute right-4 top-[65%] -translate-y-1/2 z-20 pointer-events-none lg:group-hover/slider:pointer-events-auto">
          <button
            onClick={() => handleScroll('right')}
            className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-purple-600 shadow-2xl border border-purple-50 hover:bg-purple-600 hover:text-white transition-all duration-500 opacity-0 lg:group-hover/slider:opacity-100 translate-x-4 lg:group-hover/slider:translate-x-0 active:scale-90"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* 🎡 รายการหมวดหมู่สินค้า */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            /* Skeleton Loading State */
            [...Array(6)].map((_, i) => (
              <div key={`skel-${i}`} className="flex flex-col items-center gap-5 flex-shrink-0 w-28 sm:w-32 animate-pulse">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-purple-50 rounded-full"></div>
                <div className="w-16 h-4 bg-purple-50 rounded-full"></div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.type}`)}
                className="flex flex-col items-center gap-5 cursor-pointer flex-shrink-0 w-28 sm:w-32 group/item"
              >
                {/* 🌈 วงกลมล้อมรอบรูปภาพที่มีลูกเล่นไล่เฉด */}
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-0 group-hover/item:opacity-20 blur-md transition-opacity duration-500"></div>
                  
                  {/* Main Circle Container */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-50 to-white rounded-full border-2 border-white shadow-xl group-hover/item:shadow-purple-200/50 flex items-center justify-center p-3 transition-all duration-500 group-hover/item:-translate-y-3 group-hover/item:scale-105 overflow-hidden">
                    
                    {/* Subtle Background Pattern in circle */}
                    <div className="absolute inset-0 opacity-[0.03] group-hover/item:opacity-[0.07] transition-opacity">
                      <svg width="100%" height="100%"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid)"/></svg>
                    </div>

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover/item:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        // fallback icon style if image fails
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-purple-50 items-center justify-center text-purple-300">
                      <Filter size={32} strokeWidth={1.5} />
                    </div>

                    {/* Glass Shine Effect */}
                    <div className="absolute top-[-100%] left-[-100%] w-1/2 h-[200%] bg-white/20 rotate-[35deg] group-hover/item:top-[100%] group-hover/item:left-[100%] transition-all duration-1000 ease-in-out"></div>
                  </div>
                </div>

                {/* 🏷️ ชื่อหมวดหมู่สินค้าที่มีสไตล์ */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-sm sm:text-base text-slate-600 font-black tracking-tight group-hover/item:text-purple-600 transition-colors duration-300">
                    {cat.name}
                  </span>
                  <div className="w-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full group-hover/item:w-8 transition-all duration-500"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-slate-400 font-medium">ไม่พบหมวดหมู่สินค้า</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;