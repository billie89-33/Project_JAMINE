import { useState } from 'react';
import { 
  BannerList, 
  BannerForm, 
  useBanners 
} from '@/modules/admin/advertising';
import { Megaphone, Plus, ArrowLeft } from 'lucide-react';

/**
 * 🚀 AdvertisingPage (Admin)
 * หน้าจัดการป้ายโฆษณาและแบนเนอร์โปรโมชัน
 */
const AdvertisingPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const { 
    banners, 
    isLoading, 
    isSubmitting, 
    handleCreate,
    handleUpdate,
    handleDelete, 
    refreshBanners 
  } = useBanners();

  // จัดการการส่งข้อมูลฟอร์ม (ทั้งสร้างใหม่และแก้ไข)
  const handleFormSubmit = async (formData, id) => {
    let success;
    if (id) {
      // โหมดแก้ไข (Surgical Patch)
      success = await handleUpdate(id, formData);
    } else {
      // โหมดสร้างใหม่ (POST)
      success = await handleCreate(formData);
    }

    if (success) {
      setEditingBanner(null);
      setIsAdding(false);
    }
  };

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setIsAdding(true);
  };

  const handleBackToList = () => {
    setEditingBanner(null);
    setIsAdding(false);
  };

  if (isLoading && banners.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse">
          กำลังเตรียมข้อมูลแบนเนอร์...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 🏷️ Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white p-2.5 rounded-2xl shadow-lg shadow-purple-200">
                <Megaphone size={24} strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {editingBanner ? 'Edit Banner' : isAdding ? 'Create New Banner' : 'Advertising Management'}
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">
              {editingBanner ? 'แก้ไขข้อมูลแบนเนอร์ปัจจุบัน' : isAdding ? 'เพิ่มป้ายโฆษณาใหม่เข้าสู่ระบบ' : 'จัดการป้ายโปรโมชันและตำแหน่งแสดงผลหน้าเว็บ'}
            </p>
          </div>

          <button 
            onClick={isAdding ? handleBackToList : () => setIsAdding(true)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
              isAdding 
                ? 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50' 
                : 'bg-slate-900 text-white hover:bg-purple-600 shadow-slate-200'
            }`}
          >
            {isAdding ? (
              <><ArrowLeft size={16} strokeWidth={3} /> Back to List</>
            ) : (
              <><Plus size={16} strokeWidth={3} /> Add New Banner</>
            )}
          </button>
        </div>

        {/* 📦 Main Content */}
        {isAdding ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BannerForm 
              initialData={editingBanner}
              onSubmit={handleFormSubmit}
              onCancel={handleBackToList}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <BannerList 
              banners={banners} 
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default AdvertisingPage;
