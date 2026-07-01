import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHome } from '../hooks/useHome';
import { useNavigate } from 'react-router-dom';

interface HeroBannerProps {
  placement?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ placement = 'home_hero' }) => {
  const navigate = useNavigate();
  const { banners, loading } = useHome(placement);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  // ระบบ Auto-play สไลด์ทุกๆ 5 วินาที
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, banners.length, nextSlide]);

  if (loading) {
    return (
      <div className="relative w-full h-[300px] md:h-[450px] rounded-[40px] overflow-hidden bg-slate-900/10 backdrop-blur-md border-4 border-white/80 shadow-2xl flex flex-col justify-end p-6 md:p-10 space-y-3 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/20 via-slate-100/30 to-purple-100/10"></div>
        <div className="relative z-10 h-8 md:h-10 bg-white/60 rounded-xl w-3/4 md:w-1/2"></div>
        <div className="relative z-10 h-6 md:h-8 bg-purple-200/60 rounded-full w-32 md:w-40"></div>
      </div>
    );
  }

  // กรณีไม่มีแบนเนอร์ให้โชว์เป็น Default Box
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[450px] rounded-[40px] overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-purple-100">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-widest">Jamine Grand Sale</h2>
          <p className="text-purple-100 font-medium">สัมผัสประสบการณ์เทคโนโลยีระดับพรีเมียมที่นี่</p>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[300px] md:h-[450px] rounded-[40px] overflow-hidden group shadow-2xl shadow-purple-200/50 border-4 border-white bg-slate-900">
      
      {/* 1. ชั้นหลัง: บรรยากาศฟุ้งกระจาย (Blurred Atmosphere) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40">
        <img
          src={currentBanner.image.url}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125"
        />
      </div>

      {/* 2. ชั้นหน้า: รูปภาพแบนเนอร์จริง (เห็นครบถ้วน ไม่โดนกิน) */}
      <div 
        className="relative w-full h-full cursor-pointer flex items-center justify-center p-4 md:p-8"
        onClick={() => currentBanner.linkUrl && navigate(currentBanner.linkUrl)}
      >
        <img
          src={currentBanner.image.url}
          alt={currentBanner.title}
          className="w-full h-full object-contain transition-transform duration-[2000ms] group-hover:scale-105 drop-shadow-2xl"
        />
        
        {/* แถบพาดข้อมูลแบนเนอร์ */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none lg:hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none hidden lg:block"></div>
        
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white space-y-1 md:space-y-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
           <h3 className="text-lg md:text-2xl font-black uppercase tracking-widest drop-shadow-lg">{currentBanner.title}</h3>
           <p className="text-[9px] md:text-xs font-bold text-purple-100 uppercase tracking-[0.3em] bg-purple-600/80 md:bg-purple-600/50 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full w-fit">Explore Collection</p>
        </div>
      </div>

      {/* 2. ปุ่มลูกศรซ้าย-ขวา ธีมม่วงสดใสสะดุดตา */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute top-1/2 left-3 md:left-6 -translate-y-1/2 p-2 md:p-4 bg-white/90 backdrop-blur-xl rounded-xl md:rounded-[20px] shadow-2xl text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:-translate-x-4 lg:group-hover:translate-x-0 active:scale-90"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute top-1/2 right-3 md:right-6 -translate-y-1/2 p-2 md:p-4 bg-white/90 backdrop-blur-xl rounded-xl md:rounded-[20px] shadow-2xl text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0 active:scale-90"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>

          {/* 3. Indicators (จุดเล็กๆ ด้านล่าง) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              ></div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default HeroBanner;