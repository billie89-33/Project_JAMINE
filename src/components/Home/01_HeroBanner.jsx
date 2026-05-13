import  { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios'; 

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. ดึงข้อมูล Banner จาก API ของฝั่ง Admin
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // เปลี่ยน URL เอนพอยต์ตามจริงของโปรเจกต์คุณได้เลยครับ
        const response = await axios.get('/api/admin/banners'); 
        
        if (response.data && response.data.length > 0) {
          setBanners(response.data);
        } else {
          // ถ้าไม่มีข้อมูลในเบส ให้ใช้รูปเริ่มต้น (Fallback Data)
          setBanners([
            { id: 'default', imageUrl: 'placehold.co' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
        // เผื่อ API พัง ให้แสดงรูป Default ป้องกันหน้าจอขาว
        setBanners([
          { id: 'fallback', imageUrl: 'placehold.co' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // ฟังก์ชันเลื่อนสไลด์แบนเนอร์
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // 2. ระหว่างรอข้อมูลแสดงผล Loading Skeleton UI ให้สวยงาม
  if (loading) {
    return (
      <div className="w-full h-[350px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400 font-medium">
        กำลังโหลดแบนเนอร์กิจกรรม...
      </div>
    );
  }

  // 3. เมื่อดึงข้อมูลเสร็จแล้ว ทำการเรนเดอร์ภาพสไลเดอร์ที่มาจากแอดมิน
  return (
    <div className="relative w-full h-[350px] rounded-lg overflow-hidden group shadow-sm bg-gray-100">
      {/* ภาพแบนเนอร์ปัจจุบัน */}
      <img
        src={banners[currentIndex]?.imageUrl}
        alt={`Banner ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* แสดงปุ่มควบคุมเฉพาะกรณีมีแบนเนอร์มากกว่า 1 รูป */}
      {banners.length > 1 && (
        <>
          {/* ปุ่มลูกศรซ้าย */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          {/* ปุ่มลูกศรขวา */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* จุดวงกลมบอกตำแหน่งสไลด์ (Dots Indicators) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? 'bg-black w-5' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBanner;