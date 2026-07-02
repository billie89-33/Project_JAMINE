import { useState } from 'react';
import { Image as ImageIcon, Upload, Loader2, Sparkles } from 'lucide-react';

/**
 * 🏷️ CategoryCoverGrid Component
 * แสดงการ์ดตารางภาพปกหมวดหมู่ทั้งหมด พร้อมฟังก์ชันอัปโหลดภาพ
 */
export const CategoryCoverGrid = ({ categories, coversMap, onUpload, isSubmitting }) => {
  const [uploadingCat, setUploadingCat] = useState(null);

  const handleFileChange = async (categoryName, e) => {
    const inputElement = e.target;
    const file = inputElement.files?.[0];
    if (!file) return;

    setUploadingCat(categoryName);
    await onUpload(categoryName, file);
    setUploadingCat(null);
    // เคลียร์ input file อย่างปลอดภัยหลัง await
    inputElement.value = '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((catName) => {
        const currentCover = coversMap[catName];
        const isCurrentUploading = isSubmitting && uploadingCat === catName;

        return (
          <div 
            key={catName} 
            className="bg-white rounded-[32px] p-6 shadow-xl shadow-purple-100/40 border border-purple-50 flex flex-col gap-6 group hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-1 transition-all duration-300"
          >
            {/* 1. Category Name & Badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 group-hover:text-purple-600 transition-colors tracking-tight">
                {catName}
              </h3>
              {currentCover ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
                  <Sparkles size={12} /> Premium Cover
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Default / Product Fallback
                </span>
              )}
            </div>

            {/* 2. Image Preview Section */}
            <div className="relative w-full h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group-hover:border-purple-100 transition-colors flex items-center justify-center">
              {currentCover ? (
                <img 
                  src={currentCover} 
                  alt={catName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    ((e.target as HTMLElement).nextSibling as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              
              <div className={`${currentCover ? 'hidden' : 'flex'} flex-col items-center gap-2 text-slate-300`}>
                <ImageIcon size={32} strokeWidth={1.5} />
                <span className="text-xs font-bold text-slate-400">ยังไม่มีภาพปกเฉพาะ</span>
                <span className="text-[10px] text-slate-400 max-w-[200px] text-center">
                  (ระบบจะแสดงภาพสินค้าล่าสุดในหมวดหมู่นี้โดยอัตโนมัติ)
                </span>
              </div>

              {/* Uploading Overlay */}
              {isCurrentUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-purple-600 z-10">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest animate-pulse">กำลังอัปโหลดภาพ...</span>
                </div>
              )}
            </div>

            {/* 3. Upload Action Button */}
            <div className="mt-auto">
              <label className={`group/btn relative flex items-center justify-center gap-2 w-full py-3.5 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-200 cursor-pointer active:scale-95 ${isCurrentUploading ? 'pointer-events-none opacity-50' : ''}`}>
                <Upload size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                <span>{currentCover ? 'เปลี่ยนภาพปกใหม่' : 'อัปโหลดภาพปก'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(catName, e)}
                  disabled={isCurrentUploading}
                />
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
};
