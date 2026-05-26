
import { ArrowUpRight } from 'lucide-react';

const SidebarNews = () => {
  // จำลองรายการข่าวสารย่อย 3 ข่าว
  const miniNews = Array.from({ length: 3 }, (_, i) => i + 1);

  return (
    <div className=" p-5 rounded-xl   flex flex-col gap-5 w-full">
      
      {/* กลุ่มปุ่ม Social Media */}
      <div className="grid grid-cols-2 gap-2">
        <a href="#" className="bg-[#1877F2] text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:opacity-90 transition-opacity">Facebook <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-black text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:bg-zinc-900 transition-colors">X <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#E60023] text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:opacity-90 transition-opacity">Pinterest <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#FF0000] text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:opacity-90 transition-opacity">YouTube <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#1ED760] text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:opacity-90 transition-opacity">Spotify <ArrowUpRight size={14}/></a>
        <a href="#" className="bg-[#0077B5] text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold hover:opacity-90 transition-opacity">LinkedIn <ArrowUpRight size={14}/></a>
      </div>

      {/* หัวข้อข่าวสาร */}
      <div>
        <h3 className="text-base font-extrabold text-gray-900 border-l-4 border-purple-600 pl-2">More News</h3>
      </div>
      
      {/* ข่าวเด่นหลักตัวบนสุด */}
      <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm border border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
        <img 
          src="unsplash.com" 
          alt="Main News" 
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'placehold.co'; }}
        />
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <span className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">Health</span>
          <p className="text-white font-bold text-sm mt-2 leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors">
            Recovery and Cleanup in Florida After Hurricane Ian
          </p>
          <p className="text-gray-300 text-[10px] mt-1.5">By Daily · May 24, 2026</p>
        </div>
      </div>

      {/* รายการข่าวสารย่อยด้านล่าง */}
      <div className="flex flex-col gap-4">
        {miniNews.map((news) => (
          <div key={news} className="flex gap-3 items-center border-b border-purple-50 pb-3 cursor-pointer group last:border-none last:pb-0">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-purple-50 flex-shrink-0 border border-purple-100">
              <img 
                src="unsplash.com" 
                alt="Thumb" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                onError={(e) => { e.target.src = 'placehold.co'; }}
              />
            </div>
            <div className="flex-grow">
              <span className="bg-purple-100 text-purple-700 font-bold text-[9px] px-2 py-0.5 rounded-full">Health</span>
              <h4 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                Why is the Most American Fruit So Hard to Buy?
              </h4>
              <p className="text-gray-400 text-[9px] mt-0.5">May 24, 2026</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SidebarNews;