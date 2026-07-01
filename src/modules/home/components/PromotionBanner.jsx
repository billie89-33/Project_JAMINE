

import { useHome } from '../hooks/useHome';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

const PromotionBanner = () => {
  const navigate = useNavigate();
  const { banners, loading } = useHome('promotion_bar');

  if (loading) {
    return (
      <div className="w-full h-[150px] sm:h-[200px] bg-gradient-to-r from-purple-100/60 to-indigo-100/60 rounded-[32px] border-2 border-white shadow-xl shadow-purple-100/30 flex items-center justify-between p-6 sm:p-8 overflow-hidden relative animate-pulse">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-purple-200 rounded-full w-24"></div>
          <div className="h-6 sm:h-8 bg-white/80 rounded-xl w-4/5"></div>
          <div className="h-3 bg-indigo-200 rounded-full w-1/2"></div>
        </div>
        <div className="w-20 sm:w-28 h-8 sm:h-10 bg-white/80 rounded-xl"></div>
      </div>
    );
  }

  // ถ้าไม่มีแบนเนอร์โปรโมชัน ให้โชว์ Default Style
  if (banners.length === 0) {
    return (
      <div className="w-full p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[32px] shadow-xl shadow-purple-100 flex items-center justify-between overflow-hidden relative group">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-purple-200">
            <Megaphone size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Deal</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Level Up Your Setup</h3>
          <p className="text-indigo-100 text-xs font-bold">Discover our new gaming accessories collection.</p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={() => navigate('/category/All')}
            className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all active:scale-95"
          >
            Shop Now
          </button>
        </div>
        
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] right-[-5%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      </div>
    );
  }

  // ใช้แบนเนอร์อันแรกที่ได้มา
  const promo = banners[0];

  return (
    <div 
      onClick={() => promo.linkUrl && navigate(promo.linkUrl)}
      className="w-full h-[150px] sm:h-[200px] overflow-hidden rounded-[32px] shadow-2xl shadow-purple-100/50 border-2 border-white hover:border-purple-200 transition-all duration-500 cursor-pointer group relative bg-slate-900"
    >
      {/* ชั้นหลัง: พื้นหลังเบลอคุมโทน */}
      <div className="absolute inset-0 opacity-30">
        <img
          src={promo.image.url}
          alt=""
          className="w-full h-full object-cover blur-2xl scale-125"
        />
      </div>

      {/* ชั้นหน้า: รูปภาพแบนเนอร์จริงแบบ Contain */}
      <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-5">
        <img
          src={promo.image.url}
          alt={promo.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-[1500ms] drop-shadow-xl"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center px-10">
         <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] shadow-xl">Get Offer ✨</span>
      </div>
    </div>
  );
};

export default PromotionBanner;