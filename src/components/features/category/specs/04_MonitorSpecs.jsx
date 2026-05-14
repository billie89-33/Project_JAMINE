const MonitorSpecs = () => {
  const refreshRates = ['60Hz', '144Hz', '240Hz', '360Hz'];
  const panelTypes = ['IPS', 'VA', 'OLED'];

  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 border-l-4 border-purple-600 pl-2">Gaming Monitor Specs Filter</h3>
        <p className="text-xs text-gray-400 mt-0.5">เลือกความลื่นไหลประเภทพาเนลจอภาพ</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* ส่วนเลือก Refresh Rate */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Refresh Rate</span>
          <div className="flex flex-wrap gap-2">
            {refreshRates.map((hz) => (
              <button key={hz} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {hz}
              </button>
            ))}
          </div>
        </div>

        {/* ส่วนเลือกประเภทพาเนล */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Panel Type</span>
          <div className="flex flex-wrap gap-2">
            {panelTypes.map((panel) => (
              <button key={panel} className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95">
                {panel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 p-6 bg-purple-50/50 border border-dashed border-purple-200 rounded-lg text-center text-xs font-bold text-purple-600/80 animate-pulse">
        📺 รายการสินค้ากลุ่ม Monitor / จอภาพคอมพิวเตอร์ จะลูปแสดงผลตรงนี้
      </div>
    </div>
  );
};

export default MonitorSpecs;