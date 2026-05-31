import { useState, useEffect, useCallback } from 'react';
import { getAdminBannersApi, createBannerApi, updateBannerApi, deleteBannerApi } from '../services/bannerApi';
import toast from 'react-hot-toast';

/**
 * 🎣 useBanners Hook
 * จัดการสถานะและ Logic สำหรับการจัดการ Banner
 */
export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. ดึงข้อมูลแบนเนอร์ทั้งหมด
  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminBannersApi();
      if (res.success) {
        setBanners(res.data);
      }
    } catch (error) {
      // toast.error('ไม่สามารถโหลดข้อมูลแบนเนอร์ได้');
      // Mock data for initial dev if API not ready
      setBanners([
        { 
          _id: 'mock1', 
          title: 'Summer Sale', 
          placement: 'home_hero', 
          isActive: true, 
          image: { url: 'https://via.placeholder.com/1920x600' },
          linkUrl: '/category/Notebook',
          order: 1
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // 2. จัดการการอัปเดต
  const handleUpdate = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const res = await updateBannerApi(id, formData);
      if (res.success) {
        toast.success('อัปเดตแบนเนอร์เรียบร้อยแล้ว');
        fetchBanners();
        return true;
      }
    } catch (error) {
      toast.error('อัปเดตไม่สำเร็จ');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. จัดการการลบ
  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์นี้?')) return;
    
    try {
      const res = await deleteBannerApi(id);
      if (res.success) {
        toast.success('ลบแบนเนอร์เรียบร้อยแล้ว');
        fetchBanners();
      }
    } catch (error) {
      toast.error('ลบไม่สำเร็จ');
    }
  };

  return {
    banners,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    handleDelete,
    refreshBanners: fetchBanners
  };
};
