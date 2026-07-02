import { useCategoryCovers, CategoryCoverGrid } from '@/modules/admin/category-covers';
import { Layers, Sparkles } from 'lucide-react';

/**
 * 🚀 CategoryCoversPage (Admin)
 * หน้าจัดการภาพปกหมวดหมู่ (Category Covers)
 */
const CategoryCoversPage = () => {
  const { 
    categories, 
    coversMap, 
    isLoading, 
    isSubmitting, 
    handleUploadCover 
  } = useCategoryCovers();

  if (isLoading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse">
          กำลังเตรียมข้อมูลหมวดหมู่...
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
                <Layers size={24} strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Category Covers Management
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">
              จัดการภาพปกพรีเมียมสำหรับหมวดหมู่สินค้าบน Category Slider หน้าแรก
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-purple-100 rounded-2xl shadow-sm text-purple-600 text-xs font-bold">
            <Sparkles size={16} className="animate-spin" />
            <span>ระบบบันทึกและสวมทับภาพบนหน้าแรกให้อัตโนมัติ</span>
          </div>
        </div>

        {/* 📦 Main Content */}
        <div className="animate-in fade-in duration-500">
          <CategoryCoverGrid 
            categories={categories}
            coversMap={coversMap}
            onUpload={handleUploadCover}
            isSubmitting={isSubmitting}
          />
        </div>

      </div>
    </div>
  );
};

export default CategoryCoversPage;
