import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios'; 

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // เรียก Endpoint จริงจาก Backend API ของแอดมิน
        const response = await axios.get('/api/admin/banners'); 
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setBanners(response.data);
        } else {
          // หากไม่มีข้อมูลในฐานข้อมูล ให้ใช้รูป Mockup เริ่มต้น 3 รูปตามดีไซน์
          setBanners([
            { id: 'mock1', imageUrl: 'unsplash.com' },
            { id: 'mock2', imageUrl: 'unsplash.com' },
            { id: 'mock3', imageUrl: 'unsplash.com' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
        // หาก API ขัดข้อง ให้ใช้รูป Fallback สำรอง 3 รูปเพื่อป้องกันระบบพัง
        setBanners([
          { id: 'fallback1', imageUrl: 'unsplash.com' },
          { id: 'fallback2', imageUrl: 'unsplash.com' },
          { id: 'fallback3', imageUrl: 'unsplash.com' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const safeBanners = Array.isArray(banners) ? banners : [];

  const prevSlide = () => {
    if (safeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? safeBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (safeBanners.length === 0) return;
    setCurrentIndex((prev) => (prev === safeBanners.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400 font-medium">
        กำลังโหลดแบนเนอร์กิจกรรม...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      
      {/* 1. ส่วนกรอบภาพสไลเดอร์หลักขนาดใหญ่ */}
      <div className="relative w-full h-[320px] rounded-lg overflow-hidden group bg-gray-50 flex items-center justify-center">
        {safeBanners.length > 0 && (
          <img
            src={safeBanners[currentIndex]?.imageUrl}
            alt={`Banner ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-all duration-500"
            onError={(e) => { e.target.src = 'placehold.co'; }}
          />
        )}

        {safeBanners.length > 1 && (
          <>
            {/* ปุ่มลูกศรซ้าย */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow border border-gray-100 text-gray-700 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>

            {/* ปุ่มลูกศรขวา */}
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow border border-gray-100 text-gray-700 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* 2. ส่วนแสดงภาพพรีวิวขนาดเล็ก 3 รูปด้านล่างสำหรับคลิกเปลี่ยนสไลด์ (Thumbnail Navigation) */}
      {safeBanners.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex justify-center gap-3">
            {safeBanners.slice(0, 3).map((banner, idx) => (
              <button
                key={banner.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-16 h-12 rounded border-2 overflow-hidden bg-gray-50 p-1 transition-all ${
                  currentIndex === idx 
                    ? 'border-black scale-105 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img 
                  src={banner.imageUrl} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = 'placehold.co'; }}
                />
              </button>
            ))}
          </div>

          {/* จุดวงกลมขนาดเล็กบอกตำแหน่งกรณีมีภาพมากกว่า 3 รูป */}
          {safeBanners.length > 3 && (
            <div className="flex gap-1.5">
              {safeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? 'bg-black w-3' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default HeroBanner;