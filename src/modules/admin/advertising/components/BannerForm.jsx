import { useState, useEffect } from 'react';
import { ImageUploadBox } from '@/modules/admin/addproduct';
import { Save, Info, Image as ImageIcon } from 'lucide-react';

/**
 * ✨ BannerForm Component
 * ฟอร์มเพิ่ม/แก้ไขแบนเนอร์ (Surgical Layout)
 */
export const BannerForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    linkUrl: '',
    placement: 'home_hero',
    order: 0,
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 🖼️ กำหนด Aspect Ratio ตาม Placement
  const placementRatios = {
    'home_hero': '1920/600',
    'category_hero': '1600/400',
    'promotion_bar': '3/1',
    'side_ad': '1/1'
  };

  // Sync state with initialData when editing
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: initialData.title || '',
        linkUrl: initialData.linkUrl || '',
        placement: initialData.placement || 'home_hero',
        order: initialData.order || 0,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
      if (initialData.image?.url) {
        setImagePreview(initialData.image.url);
      }
    }
  }, [initialData]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🛡️ 1. Validation: ถ้าสร้างใหม่ ต้องมีรูป!
    if (!initialData && !selectedFile) {
      toast.error('กรุณาเลือกรูปภาพแบนเนอร์ก่อนกดบันทึก');
      return;
    }

    const submitData = new FormData();
    let hasChanges = false;
    
    // 🛡️ 2. Surgical Update (Dirty Checking): ส่งเฉพาะฟิลด์ที่เปลี่ยน
    Object.entries(formData).forEach(([key, value]) => {
      // สำหรับโหมดแก้ไข ตรวจสอบว่าค่าต่างจากเดิมไหม
      if (initialData) {
        if (value !== initialData[key]) {
          submitData.append(key, value);
          hasChanges = true;
        }
      } else {
        // โหมดสร้างใหม่ ส่งทั้งหมด
        submitData.append(key, value);
        hasChanges = true;
      }
    });
    
    // 3. ตรวจสอบรูปภาพใหม่
    if (selectedFile) {
      submitData.append('image', selectedFile);
      hasChanges = true;
    }

    if (initialData && !hasChanges) {
      toast('ข้อมูลไม่มีการเปลี่ยนแปลง', { icon: 'ℹ️' });
      return onCancel(); 
    }
    
    // 🔍 Debug: ตรวจสอบข้อมูลใน FormData ก่อนส่งจริง
    console.log('🚀 Final Banner Payload (FormData):');
    for (const [key, value] of submitData.entries()) {
      if (key === 'image') {
        console.log(`- ${key}:`, value instanceof File ? `File [${value.name}]` : 'Not a File!');
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }

    // 🚀 ส่งข้อมูลไปที่ Handler (หน้า Page)
    onSubmit(submitData, initialData?._id);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ⬅️ Left: Image Upload */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Banner Media</h3>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all group shadow-inner">
              <ImageUploadBox 
                imagePreview={imagePreview} 
                onFileSelect={handleFileSelect} 
                aspectRatio={placementRatios[formData.placement] || '3/1'} 
              />
            </div>
            
            <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <Info size={16} className="text-indigo-500 mt-0.5" />
              <p className="text-[10px] text-indigo-600 font-bold leading-relaxed">
                คำแนะนำ: สำหรับ Home Hero แนะนำขนาด 1920x600px และสำหรับ Category Banner แนะนำขนาด 1600x400px เพื่อผลลัพธ์ที่ดีที่สุด
              </p>
            </div>
          </div>
        </div>

        {/* ➡️ Right: Details Form */}
        <div className="flex-[1.2] space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title</label>
              <input 
                type="text" 
                placeholder="เช่น Summer Grand Sale 2026..." 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Link (LinkUrl)</label>
              <input 
                type="text" 
                placeholder="เช่น /category/Notebook หรือ /product/id..." 
                value={formData.linkUrl}
                onChange={e => setFormData({...formData, linkUrl: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Placement</label>
                <select 
                  value={formData.placement}
                  onChange={e => setFormData({...formData, placement: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer"
                >
                  <option value="home_hero">Home - Main Slider</option>
                  <option value="category_hero">Category - Top Banner</option>
                  <option value="promotion_bar">Promotion Bar (Small)</option>
                  <option value="side_ad">Side Ad</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Order</label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={e => setFormData({...formData, order: Number(e.target.value)})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group w-max">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-600 transition-colors">เปิดใช้งาน (Active Status)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-5 rounded-[24px] bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-[1.5] py-5 rounded-[24px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isSubmitting ? 'bg-slate-300' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200 hover:-translate-y-0.5'
              }`}
            >
              <Save size={16} strokeWidth={3} />
              {isSubmitting ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
