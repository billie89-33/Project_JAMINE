import { NotebookSpecs, KeyboardSpecs, ComputerSpecs, MonitorSpecs, MouseSpecs, GraphicsCardSpecs, RAMSpecs, MainboardSpecs } from "./specs";

// คอมโพเนนต์จำลองกรณีหมวดหมู่นั้นยังไม่มีสเปกเฉพาะ (เช่น Computer, Monitor, Mouse)
const DefaultProductList = ({ categoryName }) => (
  <div className="w-full p-8 text-center bg-white rounded-xl border border-purple-100 shadow-sm">
    <p className="text-gray-500 text-sm">กำลังแสดงรายการสินค้าทั่วไปในหมวดหมู่ <span className="font-bold text-purple-600">{categoryName}</span></p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border border-gray-100 rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center text-xs text-gray-400">
          สินค้า {categoryName} ชิ้นที่ {item}
        </div>
      ))}
    </div>
  </div>
);

const ProductSwitchCase = ({ type }) => {
  
  // แปลงตัวอักษรพิมพ์เล็กพิมพ์ใหญ่ให้ตรงกันเพื่อป้องกันข้อผิดพลาด
  const currentCategory = type?.toLowerCase();

  // ฟังก์ชันสลับการแสดงผลหน้า UI ตามหมวดหมู่สินค้า
  const renderCategoryContent = () => {
    switch (currentCategory) {
      case 'notebook':
        return <NotebookSpecs />;
      case 'keyboard':
        return <KeyboardSpecs />;
      case 'computer':
        return <ComputerSpecs />;
      case 'monitor':
        return <MonitorSpecs />;
      case 'mouse':
        return <MouseSpecs />;
      case 'graphicscard':
        return <GraphicsCardSpecs />;
      case 'ram':
        return <RAMSpecs />;
      case 'mainboard':
        return <MainboardSpecs />;
      default:
        return (
          <div className="w-full p-12 text-center bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-purple-900 font-bold">ไม่พบหมวดหมู่สินค้าที่ระบุ</h3>
            <p className="text-purple-600 text-xs mt-1">กรุณาเลือกหมวดหมู่สินค้าใหม่อีกครั้งจากเมนูด้านบน</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-stone-100 p-6 rounded-2xl border border-gray-200 min-h-[400px] shadow-inner transition-all duration-300">
      {/* ส่วนหัวแสดงชื่อหมวดหมู่ปัจจุบันแบบ Dynamic */}
      <div className="mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">🎯 Current Mode</span>
        <span className="text-sm font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase">
          {currentCategory || 'All'}
        </span>
      </div>

      {/* เรนเดอร์เนื้อหาคอมโพเนนต์ตามที่เงื่อนไข switch-case เลือก */}
      {renderCategoryContent()}
    </div>
  );
};

export default ProductSwitchCase;