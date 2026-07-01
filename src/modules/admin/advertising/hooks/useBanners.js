import { useState, useEffect, useCallback } from 'react';
import { getAdminBannersApi, createBannerApi, updateBannerApi, deleteBannerApi } from '../services/bannerApi';
import { toast } from 'react-hot-toast';

/**
 * 🎣 useBanners Hook
 * จัดการสถานะและ Logic สำหรับการจัดการ Banner (Standard Centralized Logic)
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
        setBanners(res.data || []);
      }
    } catch (error) {
      console.error('Fetch Banners Error:', error);
      // Fallback empty list if error
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, [fetchBanners]);

  // 2. จัดการการสร้างใหม่
  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await createBannerApi(formData);
      if (res.success) {
        toast.success('สร้างแบนเนอร์ใหม่สำเร็จ! ✨');
        fetchBanners();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'สร้างแบนเนอร์ไม่สำเร็จ');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. จัดการการอัปเดต
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
      toast.error(error.response?.data?.message || 'อัปเดตไม่สำเร็จ');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. จัดการการลบ
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
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshBanners: fetchBanners
  };
};
