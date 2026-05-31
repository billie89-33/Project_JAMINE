import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * 🛰️ Shared Pagination Component (Enterprise Standard)
 * รองรับการแสดงผลหน้าจำนวนมากด้วยระบบ Ellipsis (...)
 * @param {number} currentPage - หน้าปัจจุบัน
 * @param {number} totalPages - จำนวนหน้าทั้งหมด
 * @param {function} onPageChange - ฟังก์ชันทำงานเมื่อเปลี่ยนหน้า
 */
const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  
  // ฟังก์ชันคำนวณปุ่มตัวเลขที่จะแสดง (Smart Ellipsis Logic)
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // จำนวนปุ่มสูงสุดที่จะโชว์รอบๆ หน้าปัจจุบัน

    if (totalPages <= 7) {
      // ถ้าหน้ามีน้อยกว่า 7 โชว์ให้หมดเลย
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // ถ้าหน้าเยอะ ต้องเริ่มใช้ระบบ Ellipsis (...)
      pages.push(1); // หน้าแรกต้องโชว์เสมอ

      if (currentPage > 3) pages.push('ellipsis-start');

      // คำนวณช่วงของเลขหน้าที่จะโชว์รอบๆ Current Page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // ปรับให้มีอย่างน้อย 3 ปุ่มตรงกลางถ้าเป็นไปได้
      if (currentPage <= 3) end = 4;
      if (currentPage >= totalPages - 2) start = totalPages - 3;

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('ellipsis-end');

      pages.push(totalPages); // หน้าสุดท้ายต้องโชว์เสมอ
    }
    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 bg-white py-3 px-4 rounded-2xl border border-slate-100 shadow-sm max-w-max mx-auto select-none transition-all">
      
      {/* 1. ปุ่มย้อนกลับ */}
      <button 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
          currentPage === 1 
            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 active:scale-90'
        }`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* 2. รายการตัวเลขหน้า */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span key={`${page}-${index}`} className="w-8 flex justify-center text-slate-300">
                <MoreHorizontal size={16} />
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl font-bold text-sm border transition-all active:scale-90 ${
                isCurrent
                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 3. ปุ่มถัดไป */}
      <button 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
          currentPage === totalPages 
            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 active:scale-90'
        }`}
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default Pagination;