import { useParams } from 'react-router-dom';

// ดึง Component แบนเนอร์และหมวดหมู่วงกลมตัวเดิมจากโฟลเดอร์ฟีเจอร์หน้า Home มาใช้ซ้ำ (Re-use)
import HeroBanner from '../../components/features/Home/01_HeroBanner';
import CategorySlider from '../../components/features/Home/02_CategorySlider';

// ดึง Component ระบบสลับหน้าสเปกและแถบเปลี่ยนหน้าจากโฟลเดอร์หน้า Category ของตัวเอง
import ProductSwitchCase from '../../components/features/category/ProductSwitchCase';
import Pagination from '../../components/features/category/Pagination';

const CategoryPage = () => {
  // แกะค่าตัวแปรจาก URL เช่น /category/notebook จะได้ค่า type = "notebook"
  const { type } = useParams();

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-12">
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
        <ProductSwitchCase type={type} />

        {/* แถบกดเปลี่ยนหน้า (Pagination) ด้านล่างสุดของกล่องสลับข้อมูล */}
        <Pagination />
      </div>
    </div>
  );
};

export default CategoryPage;