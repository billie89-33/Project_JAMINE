import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  // วิธีแปลงจำนวนหน้าทั้งหมด (ตัวเลข) ให้กลายเป็น Array เพื่อนำไป .map() ลูปสร้างปุ่ม
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // ฟังก์ชันป้องกันเพื่อความปลอดภัย (เซฟตี้อีกชั้น)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  // ซ่อนระบบแบ่งหน้าถ้าระบบมีแค่หน้าเดียว (เพื่อความสวยงาม)
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 mt-6 bg-white py-3 px-5 rounded-xl border border-purple-100 shadow-sm max-w-max mx-auto text-xs font-semibold select-none">
      
      {/* 1. ปุ่มย้อนกลับ (Previous) จะกดไม่ได้ (Disabled) หากอยู่หน้าแรกสุด */}
      <button 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
          currentPage === 1 
            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-white border-purple-100 text-purple-600 hover:bg-purple-50 hover:border-purple-300 active:scale-95'
        }`}
      >
        <ChevronLeft size={14} className="stroke-[2.5]" />
        <span>Previous</span>
      </button>

      {/* 2. ลูปสร้างกลุ่มปุ่มตัวเลขหน้าตามจำนวนที่ Backend ส่งมาให้แบบ Dynamic */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg font-bold text-center border transition-all active:scale-95 ${
                isCurrent
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200' // ไฮไลท์สีม่วงเข้มสะดุดตาสำหรับหน้าปัจจุบัน
                  : 'bg-white border-purple-50 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 3. ปุ่มถัดไป (Next) จะกดไม่ได้หากอยู่หน้าสุดท้าย*/}
      <button 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
          currentPage === totalPages 
            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-white border-purple-100 text-purple-600 hover:bg-purple-50 hover:border-purple-300 active:scale-95'
        }`}
      >
        <span>Next</span>
        <ChevronRight size={14} className="stroke-[2.5]" />
      </button>

    </div>
  );
};

export default Pagination;