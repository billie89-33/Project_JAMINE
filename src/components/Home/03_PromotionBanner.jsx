import React, { useState, useEffect } from 'react';
import axios from 'axios'; // หรือ import instance จาก src/api/

const PromotionBanner = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotionBanner = async () => {
      try {
        setLoading(true);
        // ใส่ URL Endpoint จริงของฝั่ง Admin ที่คุณใช้จัดการรูปแบนเนอร์นี้
        const response = await axios.get('/api/admin/promotion-banner');
        
        if (response.data && response.data.imageUrl) {
          setBannerUrl(response.data.imageUrl);
        } else {
          // หากไม่มีข้อมูลในเบส ให้ดึงรูปเริ่มต้นที่คุณเซฟไว้ในโฟลเดอร์ assets
          setBannerUrl('/src/assets/summer-splash-banner.png'); 
        }
      } catch (error) {
        console.error('Failed to fetch promotion banner:', error);
        // หาก API มีปัญหา ให้แสดงรูป Default เพื่อไม่ให้หน้าเว็บเบี้ยว
        setBannerUrl('/src/assets/summer-splash-banner.png');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionBanner();
  }, []);

  // ระบบตรวจจับขณะรอข้อมูลจาก API (สร้างกรอบสีเทาเพื่อแสดงเอฟเฟกต์กระพริบรอโหลด)
  if (loading) {
    return (
      <div className="w-full h-[180px] sm:h-[240px] md:h-[280px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400 font-medium">
        กำลังโหลดแบนเนอร์โปรโมชัน...
      </div>
    );
  }

  // แสดงผลภาพจริงเมื่อโหลดเสร็จเรียบร้อย
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm bg-gray-100 hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <img
        src={bannerUrl}
        alt="Summer Splash Promotion"
        className="w-full h-full object-cover"
        onError={(e) => {
          // แซงคิวใส่รูปสำรองทันทีหาก URL รูปภาพของแอดมินพังหรือลิงก์เสีย
          e.target.src = 'placehold.co';
        }}
      />
    </div>
  );
};

export default PromotionBanner;