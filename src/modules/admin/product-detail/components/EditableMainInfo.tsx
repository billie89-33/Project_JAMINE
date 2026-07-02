import ImageUploadBox from '@/modules/admin/addproduct/components/ImageUploadBox';
import { PRODUCT_STATUS } from '@/shared/constants';

/**
 * 📝 EditableMainInfo
 * ส่วนจัดการข้อมูลพื้นฐานและสื่อ สำหรับหน้าแก้ไขสินค้า
 */
export const EditableMainInfo = ({ formData, setFormData, imagePreview, onFileSelect, categoriesList }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      
      {/* ⬅️ คอลัมน์ซ้าย: สื่อ/รูปภาพ */}
      <div className="flex-1 space-y-6">
        <label className="text-xs font-black text-purple-600 uppercase tracking-widest ml-1">Product Media</label>
        <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-purple-200 hover:border-purple-400 transition-all group shadow-inner">
          <ImageUploadBox imagePreview={imagePreview} onFileSelect={onFileSelect} />
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          <p className="text-[10px] text-purple-600 font-bold leading-relaxed">
            💡 คำแนะนำ: ใช้รูปภาพพื้นหลังขาวหรือโปร่งใส ขนาดแนะนำ 800x800px เพื่อการแสดงผลที่สวยงามที่สุดบนหน้าร้านค้า
          </p>
        </div>
      </div>

      {/* ➡️ คอลัมน์ขวา: ข้อมูลทั่วไป */}
      <div className="flex-[1.5] space-y-6">
        <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-6">
          
          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
              <input 
                type="text" 
                value={formData.brand} 
                onChange={e => setFormData({...formData, brand: e.target.value})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</label>
              <input 
                type="text" 
                value={formData.modelName} 
                onChange={e => setFormData({...formData, modelName: e.target.value})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-medium focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm resize-none" 
            />
          </div>

          {/* SKU & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Code</label>
              <input 
                type="text" 
                value={formData.sku || ''} 
                onChange={e => setFormData({...formData, sku: e.target.value})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-mono focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
              <input 
                type="text" 
                value={formData.tags} 
                onChange={e => setFormData({...formData, tags: e.target.value})} 
                placeholder="New, Sale, Gaming"
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (฿)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-purple-700 text-sm font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity</label>
              <input 
                type="number" 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <input 
                type="text"
                list="categories-list"
                placeholder="พิมพ์หรือเลือกหมวดหมู่..."
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none shadow-sm"
              />
              <datalist id="categories-list">
                {(categoriesList || []).map(cat => {
                  const name = typeof cat === 'object' ? cat.name : cat;
                  return <option key={name} value={name} />;
                })}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer shadow-sm"
              >
                <option value={PRODUCT_STATUS.ACTIVE}>Active</option>
                <option value={PRODUCT_STATUS.INACTIVE}>Inactive</option>
                <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
              </select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group w-max">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={formData.isFeatured} 
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})} 
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-600 transition-colors">สินค้าแนะนำ (Featured)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableMainInfo;
