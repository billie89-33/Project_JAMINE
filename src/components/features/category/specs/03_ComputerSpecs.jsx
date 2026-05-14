const ComputerSpecs = () => {
  // Mock Data เตรียมไว้สำหรับเปลี่ยนเป็นลูป API ในอนาคต
  const caseSizes = ['Full Tower', 'Mid Tower', 'Mini-ITX'];
  const psuWattage = ['650W', '750W', '850W', '1000W'];

  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 border-l-4 border-purple-600 pl-2">Desktop Computer Specs Filter</h3>
        <p className="text-xs text-gray-400 mt-0.5">เลือกขนาดเคสและกำลังไฟที่ต้องการจัดสเปก</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ส่วนเลือกขนาดเคส */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Case Size</span>
          <div className="flex flex-wrap gap-2">
            {caseSizes.map((size) => (
              <button key={size} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ส่วนเลือกพาวเวอร์ซัพพลาย */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Power Supply (PSU)</span>
          <div className="flex flex-wrap gap-2">
            {psuWattage.map((watt) => (
              <button key={watt} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {watt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* บล็อกจำลองพื้นที่แสดงผลสินค้า */}
      <div className="mt-2 p-6 bg-purple-50/50 border border-dashed border-purple-200 rounded-lg text-center text-xs font-bold text-purple-600/80 animate-pulse">
        🖥️ รายการสินค้ากลุ่ม Desktop PC / คอมพิวเตอร์ประกอบ จะลูปแสดงผลตรงนี้
      </div>
    </div>
  );
};

export default ComputerSpecs;