import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const mockProducts = [
    {
      id: 1,
      name: "Asus ROG Gaming Notebook",
      price: "35,900 บาท",
      cat: "notebook",
      img: "💻",
    },
    {
      id: 2,
      name: "MacBook Air M3 13-inch",
      price: "39,900 บาท",
      cat: "notebook",
      img: "💻",
    },
    {
      id: 3,
      name: "Custom Desktop PC i7",
      price: "28,500 บาท",
      cat: "computer",
      img: "🖥️",
    },
    {
      id: 4,
      name: 'LG UltraGear 27" Monitor',
      price: "8,900 บาท",
      cat: "monitor",
      img: "📺",
    },
    {
      id: 5,
      name: "Mechanical Keyboard Blue Switch",
      price: "1,590 บาท",
      cat: "keyboard",
      img: "⌨️",
    },
  ];

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSuggestions(filtered);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    resetSearchState();
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    resetSearchState();
  };

  const resetSearchState = () => {
    setSearchQuery("");
    setIsMobileSearchOpen(false);
    setIsFocused(false);
  };

  // คอมโพเนนต์ภายในสำหรับปุ่มรายการสินค้า
  const RenderProductItems = () =>
    suggestions.map((product) => (
      <button
        key={product.id}
        onMouseDown={() => handleProductClick(product.id)}
        className="w-full text-left px-4 py-3 hover:bg-purple-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors group"
      >
        <span className="text-xl bg-gray-100 p-1 rounded-lg group-hover:bg-purple-100 transition-colors">
          {product.img}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-900">
            {product.name}
          </p>
          <p className="text-xs text-purple-600 font-semibold mt-0.5">
            {product.price}
          </p>
        </div>
      </button>
    ));

  return (
    <>
      {/* 💻 UI สำหรับหน้าจอ Desktop (แสดงผลปกติกลางจอคอม) */}
      <div className="hidden md:block relative w-full max-w-xs md:max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้าที่ต้องการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-4 pr-10 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white text-gray-900"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
          >
            🔍
          </button>
        </form>
        {isFocused && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
            <RenderProductItems />
          </div>
        )}
      </div>

      {/* 📱 UI สำหรับหน้าจอมือถือ (Dropdown ย้อยลงมาจากใต้ Navbar) */}
      {isMobileSearchOpen && (
        <div className="absolute left-0 right-0 top-full bg-purple-700 p-3 shadow-xl border-t border-purple-600 z-40 md:hidden animate-fadeIn">
          {/* 💡 เพิ่ม flex และ gap เพื่อจัดวางปุ่มย้อนกลับให้อยู่ข้างหน้าช่องค้นหาพอดี */}
          <div className="flex items-center gap-2 w-full">
            {/* ⬅️ ปุ่มย้อนกลับสำหรับกดปิดแถบค้นหาบนมือถือ */}
            <button
              type="button"
              onClick={() => resetSearchState()} // เรียกฟังก์ชันล้างค่าและปิดแถบค้นหาทันที
              className="p-1.5 text-white hover:bg-purple-600 rounded-full transition-colors text-lg"
            >
              ⬅️
            </button>

            {/* ช่องกรอกค้นหา (ห่อด้วย flex-1 เพื่อให้ขยายกว้างเต็มพื้นที่ที่เหลือ) */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="พิมพ์เพื่อค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsFocused(false), 200);
                }}
                className="w-full pl-4 pr-10 py-2 rounded-lg focus:outline-none text-sm bg-white text-gray-900"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                🔍
              </button>
            </form>
          </div>

          {/* 💡 ขยับตำแหน่งกล่องดรอปดาวน์สินค้าลงมาอีกนิด (เพิ่ม mt-3 และเลื่อนไปชิดขวาตามช่องอินพุต) */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute left-9 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-52 overflow-y-auto z-50">
              <RenderProductItems />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;
