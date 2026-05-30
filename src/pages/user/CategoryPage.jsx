import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { HeroBanner } from '@/modules/home';
import { CategorySlider } from '@/shared/components';

// ดึง Component ระบบสลับหน้าสเปกและแถบเปลี่ยนหน้าจากโฟลเดอร์หน้า Category ของตัวเอง
import { ProductSwitchCase, Pagination } from '@/modules/products';

const CategoryPage = () => {
  // แกะค่าตัวแปรจาก URL เช่น /category/notebook จะได้ค่า type = "notebook"
  const { type } = useParams();

  // 1. สร้าง State สำหรับคุมการแบ่งหน้าแบบอัตโนมัติ
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50 pb-12">
      {/* 1. แบนเนอร์สไลเดอร์รูปใหญ่ (ดึงรูปจำลองสีม่วงสดใสมาใช้ร่วมกัน) */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <HeroBanner />
      </div>

      {/* 2. รายการหมวดหมู่สินค้าวงกลม (แถวสไลด์แนวนอน) */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <CategorySlider />
      </div>

      {/* 3. กล่องสีเทา Switch Case จัดการแยกฟอร์ม Specs ตามหมวดหมู่ และแถบแบ่งหน้า */}
      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-6">
        
        {/* ส่งค่าหมวดหมู่สินค้าที่ผู้ใช้กดเลือกจาก Navbar เข้าไปให้กล่อง Switch Case ทำงาน */}
        {/* 🌟 ส่งฟังก์ชัน setTotalPages เข้าไปเพื่อให้คอมโพเนนต์ลูกรายงานจำนวนหน้ากลับมา */}
        <ProductSwitchCase 
          type={type} 
          setTotalPages={setTotalPages} 
          currentPage={currentPage} 
        />

        {/* 🌟 แถบกดเปลี่ยนหน้าจะโชว์/ซ่อนอัตโนมัติ (ถ้า totalPages <= 1 จะไม่โชว์ตามที่เราเขียนไว้ใน Pagination.jsx) */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default CategoryPage;