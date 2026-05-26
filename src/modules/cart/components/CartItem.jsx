export default function CartItem({ product, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 py-6">
      {/* ข้อมูลสินค้า */}
      <div className="flex gap-4 flex-1">
        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50 flex items-center justify-center text-gray-400">
          🖼️
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-base">{product.name}</h3>
            <p className="text-gray-400 text-sm mt-0.5">{product.description}</p>
          </div>
          <button 
            onClick={() => onRemove(product.id)}
            className="text-red-400 text-xs text-left font-medium hover:text-red-600 transition-colors mt-2"
          >
            Remove
          </button>
        </div>
      </div>

      {/* ตัวปรับจำนวนและราคา */}
      <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
        {/* ปุ่มเพิ่มลด */}
        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg p-1">
          <button 
            onClick={() => onDecrease(product.id)} 
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white rounded-md transition-all font-medium text-lg"
          >
            -
          </button>
          <span className="w-10 text-center font-semibold text-gray-700 text-sm">{product.quantity}</span>
          <button 
            onClick={() => onIncrease(product.id)} 
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white rounded-md transition-all font-medium text-lg"
          >
            +
          </button>
        </div>

        {/* ราคารวมของชิ้นนั้นๆ */}
        <div className="text-right min-w-[80px]">
          <span className="text-xl font-bold text-gray-800">
            {(product.price * product.quantity).toLocaleString()}.-
          </span>
        </div>
      </div>
    </div>
  );
}