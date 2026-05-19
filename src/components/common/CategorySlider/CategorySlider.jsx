import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// 🌟 1. นำเข้า useNavigate เพื่อเปิดใช้ระบบนำทางเปลี่ยนหน้า URL
import { useNavigate } from 'react-router-dom';

// 🌟 2. อัปเดตข้อมูลจำลอง: ปรับคีย์ 'type' ให้สะกดตัวพิมพ์เล็กตรงกับเงื่อนไข Router และ Switch Case ของคุณ
const categories = [
  { id: 1, name: 'Notebook', type: 'notebook', image: 'https://unsplash.com' },
  { id: 2, name: 'Keyboard', type: 'keyboard', image: 'https://unsplash.com' },
  { id: 3, name: 'Computer ', type: 'computer', image: 'https://unsplash.com' },
  { id: 4, name: 'Monitor', type: 'monitor', image: 'https://unsplash.com' },
  { id: 5, name: 'Gaming Mouse', type: 'mouse', image: 'https://unsplash.com' },
];

const CategorySlider = () => {
  // 🌟 3. ประกาศเรียกใช้งานตัวแปรนำทางเปลี่ยนหน้ากระดาน
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // ฟังก์ชันควบคุมการเลื่อนสไลด์ซ้าย-ขวา
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.5;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 relative group/slider">
      {/* ส่วนหัวข้อแสดงผล */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
        <button className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
          View All
        </button>
      </div>

      {/* ปุ่มลูกศรซ้าย */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50 transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronLeft size={16} />
      </button>

      {/* แถบรายการหมวดหมู่สินค้า */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            // 🌟 4. ผูกคำสั่ง onClick: เมื่อลูกค้ากดเลือกวงกลมระบบจะดีดหน้าจอพุ่งไปยัง URL ของหมวดหมู่นั้นทันที
            // ตัวอย่าง: ถ้ากด Notebook ลิงก์เบราว์เซอร์จะเด้งกลายเป็น /category/notebook
            onClick={() => navigate(`/category/${cat.type}`)}
            className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0 w-28 group"
          >
            {/* วงกลมล้อมรอบรูปภาพ */}
            <div className="w-20 h-20 bg-gray-50 rounded-full border border-gray-100 overflow-hidden flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full mix-blend-multiply"
                onError={(e) => {
                  // คลุมเซฟตี้ภาพสำรองกรณีลิงก์รูปหลักดึงไม่ขึ้น
                  e.target.src = 'https://placehold.co'; 
                }}
              />
            </div>
            {/* ชื่อหมวดหมู่สินค้า */}
            <span className="text-xs text-gray-700 font-medium text-center line-clamp-1 group-hover:text-purple-600 transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* ปุ่มลูกศรขวา */}
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50 transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default CategorySlider;