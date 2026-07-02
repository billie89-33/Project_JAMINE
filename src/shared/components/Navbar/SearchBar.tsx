import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsApi } from "@/modules/products/services/productApi";

interface SearchBarProps {
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (isOpen: boolean) => void;
}

interface Suggestion {
  _id: string;
  modelName: string;
  price?: number;
  image?: {
    url: string;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔍 ค้นหาคำแนะนำ (Suggestions) แบบ Real-time พร้อม Debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        // ดึงสินค้า 5 รายการแรกที่ตรงกับคำค้นหา
        const res = await getProductsApi({ keyword: searchQuery.trim(), limit: 5 });
        if (res.success) {
          setSuggestions(res.data);
        }
      } catch (error) {
        console.error("Search suggestion error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // หน่วงเวลา 300ms

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // 🚀 นำทางไปยังหน้าสินค้าทั้งหมดพร้อมแนบคำค้นหา
    navigate(`/category/All?q=${encodeURIComponent(searchQuery.trim())}`);
    resetSearchState();
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    resetSearchState();
  };

  const resetSearchState = () => {
    setSearchQuery("");
    setIsMobileSearchOpen(false);
    setIsFocused(false);
  };

  // คอมโพเนนต์ภายในสำหรับรายการแนะนำสินค้า
  const renderProductItems = () =>
    suggestions.map((product) => (
      <button
        key={product._id}
        onMouseDown={() => handleProductClick(product._id)}
        className="w-full text-left px-4 py-3 hover:bg-purple-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors group"
      >
        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group-hover:bg-purple-100 transition-colors">
          {product.image?.url ? (
            <img src={product.image.url} alt={product.modelName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">📦</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-900">
            {product.modelName}
          </p>
          <p className="text-[10px] text-purple-600 font-black mt-0.5">
            ฿{(product.price || 0).toLocaleString()}
          </p>
        </div>
      </button>
    ));

  return (
    <>
      {/* 💻 UI สำหรับหน้าจอ Desktop */}
      <div className="hidden md:block relative w-full max-w-xs md:max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า (เช่น ASUS, RTX, Keyboard)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
               // หน่วงเวลาเล็กน้อยเพื่อให้คลิก Suggestion ทันก่อนจะหายไป
               setTimeout(() => setIsFocused(false), 200);
            }}
            className="w-full pl-4 pr-10 py-2 border border-purple-600/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-sm bg-purple-800/50 text-white placeholder:text-purple-300 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
          >
            🔍
          </button>
        </form>
        
        {isFocused && (suggestions.length > 0 || isLoading) && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Searching...</div>
            ) : (
              renderProductItems()
            )}
          </div>
        )}
      </div>

      {/* 📱 UI สำหรับหน้าจอมือถือ */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-purple-700 p-4 z-[200] md:hidden">
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => resetSearchState()}
              className="p-2 text-white hover:bg-purple-600 rounded-xl transition-colors"
            >
              ⬅️
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="ค้นหาที่นี่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl focus:outline-none text-sm bg-white text-gray-900 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600"
              >
                🔍
              </button>
            </form>
          </div>

          {(suggestions.length > 0 || isLoading) && (
            <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto overflow-x-hidden">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-slate-400 font-black">SEARCHING...</div>
              ) : (
                renderProductItems()
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchBar;
