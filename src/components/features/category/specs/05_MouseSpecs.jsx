const MouseSpecs = () => {
  const connectionTypes = ['Wired (มีสาย)', 'Wireless 2.4GHz', 'Bluetooth'];
  const weightCategories = ['Ultra-light (< 60g)', 'Lightweight (60g-80g)', 'Standard (> 80g)'];

  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 border-l-4 border-purple-600 pl-2">Gaming Mouse Specs Filter</h3>
        <p className="text-xs text-gray-400 mt-0.5">เลือกรูปแบบการส่งสัญญาณน้ำหนักตัวเมาส์</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ส่วนเลือกการเชื่อมต่อ */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Connection</span>
          <div className="flex flex-wrap gap-2">
            {connectionTypes.map((conn) => (
              <button key={conn} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {conn}
              </button>
            ))}
          </div>
        </div>

        {/* ส่วนเลือกน้ำหนัก */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Mouse Weight</span>
          <div className="flex flex-wrap gap-2">
            {weightCategories.map((weight) => (
              <button key={weight} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {weight}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 p-6 bg-purple-50/50 border border-dashed border-purple-200 rounded-lg text-center text-xs font-bold text-purple-600/80 animate-pulse">
        🖱️ รายการสินค้ากลุ่ม Gaming Mouse / เมาส์เกมมิ่ง จะลูปแสดงผลตรงนี้
      </div>
    </div>
  );
};

export default MouseSpecs;