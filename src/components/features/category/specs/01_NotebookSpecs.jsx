const NotebookSpecs = () => {
  // Mock Data สำหรับเตรียมเปลี่ยนเป็นดึงข้อมูลผ่าน API หรือส่งคำค้นหาไปฟิลเตอร์ในอนาคต
  const cpuBrands = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7'];
  const ramOptions = ['8GB DDR5', '16GB DDR5', '32GB DDR5'];
  const gpuSeries = ['NVIDIA RTX 4050', 'NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'Intel Iris Xe'];

  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-5">
      {/* ส่วนหัวระบุประเภทฟิลเตอร์ */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 border-l-4 border-purple-600 pl-2">Laptop & Notebook Specs Filter</h3>
        <p className="text-xs text-gray-400 mt-0.5">เลือกข้อมูลสเปกภายในคอมพิวเตอร์พกพาที่คุณต้องการ</p>
      </div>

      {/* แผงปุ่มเลือกสเปก (Filter Controls) */}
      <div className="flex flex-col gap-4">
        {/* 1. ส่วนเลือกหน่วยประมวลผล (CPU) */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Processor (CPU)</span>
          <div className="flex flex-wrap gap-2">
            {cpuBrands.map((cpu) => (
              <button 
                key={cpu} 
                className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95 shadow-sm"
              >
                {cpu}
              </button>
            ))}
          </div>
        </div>

        {/* 2. ส่วนเลือกหน่วยความจำ (RAM) */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Memory (RAM)</span>
          <div className="flex flex-wrap gap-2">
            {ramOptions.map((ram) => (
              <button 
                key={ram} 
                className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95 shadow-sm"
              >
                {ram}
              </button>
            ))}
          </div>
        </div>

        {/* 3. ส่วนเลือกการ์ดแสดงผล (GPU) */}
        <div>
          <span className="text-xs font-bold text-gray-500 block mb-2">Graphics Card (GPU)</span>
          <div className="flex flex-wrap gap-2">
            {gpuSeries.map((gpu) => (
              <button 
                key={gpu} 
                className="px-4 py-1.5 bg-white border border-purple-200 text-xs font-semibold text-purple-700 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 active:scale-95 shadow-sm"
              >
                {gpu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* บล็อกจำลองพื้นที่เรนเดอร์สำหรับตารางรายการสินค้าหลังจากสแกนสเปก */}
      <div className="mt-2 p-6 bg-purple-50/50 border border-dashed border-purple-200 rounded-lg text-center text-xs font-bold text-purple-600/80 animate-pulse">
        💻 รายการสินค้ากลุ่ม Laptop / Notebook ที่ถูกคัดเลือกจะลูปแสดงผลตรงพื้นที่นี้
      </div>
    </div>
  );
};

export default NotebookSpecs;