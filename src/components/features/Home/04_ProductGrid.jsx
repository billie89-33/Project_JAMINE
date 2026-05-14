

const ProductGrid = () => {
  // จำลองรายการสินค้า 6 ชิ้น (เมื่อ API พร้อม เปลี่ยนไปใช้ useState และ useEffect ดึงข้อมูล)
  const items = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));

  return (
    <div className="flex flex-col items-center w-full">
      {/* กรอบคลุมตารางสินค้า */}
      <div className="grid grid-cols-2 gap-4 w-full bg-purple-50/60 p-5 rounded-xl border border-purple-100 shadow-sm">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg p-3 shadow-sm border border-purple-100 flex flex-col gap-3 hover:shadow-md hover:border-purple-300 transition-all duration-200 group cursor-pointer"
          >
            {/* พื้นที่รูปภาพสินค้า */}
            <div className="w-full aspect-[4/3] bg-purple-200/50 rounded-md overflow-hidden flex items-center justify-center">
              <img 
                src="unsplash.com" 
                alt="Product" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = 'placehold.co'; }}
              />
            </div>
            {/* ข้อความด้านล่างสินค้า */}
            <p className="text-gray-700 text-sm text-center font-semibold py-1 bg-gray-50 rounded group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
              รายละเอียดสินค้า {item.id}
            </p>
          </div>
        ))}
      </div>
      
      {/* ปุ่ม Load more */}
      <button className="mt-5 px-8 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-full hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 shadow transition-all duration-200 active:scale-95">
        Load more
      </button>
    </div>
  );
};

export default ProductGrid;