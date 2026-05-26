import React from 'react';

/**
 * 📍 AddressSelector
 * คอมโพเนนต์สำหรับเลือกที่อยู่จัดส่ง พร้อมระบบเพิ่มและลบที่อยู่
 */
const AddressSelector = ({ 
  addresses, 
  selectedAddressId, 
  onSelectAddress,
  onAddAddress,
  onDeleteAddress
}) => {

  const handleAddNew = () => {
    // 💡 ในอนาคตสามารถเปลี่ยนเป็นเปิด Modal เพื่อกรอกข้อมูลจริง
    const name = prompt("กรุณาระบุชื่อที่ตั้ง (เช่น บ้าน, ออฟฟิศ):");
    const details = prompt("กรุณาระบุรายละเอียดที่อยู่:");
    
    if (name && details) {
      onAddAddress({ name, details });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
      <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider mb-1">Select delivery address</h3>
      
      {addresses.length > 0 ? (
        addresses.map((addr) => (
          <label 
            key={addr.id} 
            className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all relative group ${
              selectedAddressId === addr.id 
                ? 'border-purple-600 bg-purple-50/20 shadow-sm ring-1 ring-purple-100' 
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddressId === addr.id}
              onChange={() => onSelectAddress(addr.id)}
              className="mt-1 accent-purple-600 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1 flex justify-between items-start mr-8">
              <div className="flex flex-col">
                <span className="font-extrabold text-gray-900 text-xs uppercase tracking-wide">{addr.name}</span>
                <span className="text-[11px] text-gray-400 mt-1 leading-relaxed">{addr.details}</span>
              </div>
            </div>

            {/* ปุ่มแอคชั่น (แก้ไข/ลบ) */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  // ฟังก์ชันแก้ไข (ถ้ามี)
                }}
                className="text-gray-300 hover:text-purple-600 transition-colors text-xs"
                title="Edit Address"
              >
                ✏️
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
                    onDeleteAddress(addr.id);
                  }
                }}
                className="text-gray-300 hover:text-red-500 transition-colors text-xs"
                title="Delete Address"
              >
                🗑️
              </button>
            </div>
          </label>
        ))
      ) : (
        <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl">
          ยังไม่มีข้อมูลที่อยู่จัดส่ง
        </div>
      )}

      <button 
        type="button"
        onClick={handleAddNew}
        className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-purple-300 rounded-xl text-xs text-purple-600 font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-purple-50/10"
      >
        ➕ Add new location
      </button>
    </div>
  );
};

export default AddressSelector;
