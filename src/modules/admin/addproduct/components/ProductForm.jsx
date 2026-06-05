import ImageUploadBox from './ImageUploadBox';
import SpecFields from './SpecFields';
import { useAddProduct } from '../hooks/useAddProduct';
import { PRODUCT_STATUS } from '@/shared/constants';

/**
 * 📦 ProductForm (Dumb/Presentational Component)
 * ทำหน้าที่แสดงผล UI เท่านั้น โดยรับ Logic และ State ทั้งหมดมาจาก useAddProduct Hook
 */
const ProductForm = () => {
    // 🎣 ดึง Logic และ State ทั้งหมดออกมาจาก Hook
    const {
        modelName, setModelName,
        brand, setBrand,
        description, setDescription,
        sku, setSku,
        tags, setTags,
        stock, setStock,
        price, setPrice,
        category, setCategory,
        status, setStatus,
        isFeatured, setIsFeatured,
        imagePreview,
        specifications,
        isSubmitting,
        categoriesList,
        brandsList,
        handleFileSelect,
        handleAddSpecRow,
        handleSpecChange,
        handleRemoveSpec,
        handleSubmit
    } = useAddProduct();

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white p-6 md:p-10 rounded-[40px] shadow-2xl shadow-purple-100/50 border border-purple-50">
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* ⬅️ Left Column: Media & Specifications */}
                <div className="flex-1 space-y-8">
                    <div>
                        <label className="text-xs font-black text-purple-600 uppercase tracking-widest mb-3 block ml-1">Product Media</label>
                        <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors group">
                            <ImageUploadBox imagePreview={imagePreview} onFileSelect={handleFileSelect} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-black text-purple-600 uppercase tracking-widest mb-3 block ml-1">Specifications</label>
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <SpecFields 
                                category={category} 
                                specifications={specifications} 
                                onAddRow={handleAddSpecRow}
                                onSpecChange={handleSpecChange} 
                                onRemoveSpec={handleRemoveSpec}
                            />
                        </div>
                    </div>
                </div>

                {/* ➡️ Right Column: General Information */}
                <div className="flex-[1.2] space-y-6">
                    <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
                                <input 
                                    type="text" 
                                    list="brands-list"
                                    placeholder="เช่น Corsair, Razer..." 
                                    value={brand} 
                                    onChange={e => setBrand(e.target.value)} 
                                    required 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                                <datalist id="brands-list">
                                    {(brandsList || []).map(b => (
                                        <option key={b} value={b} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</label>
                                <input 
                                    type="text" 
                                    placeholder="เช่น K70 RGB PRO..." 
                                    value={modelName} 
                                    onChange={e => setModelName(e.target.value)} 
                                    required 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                                placeholder="ระบุรายละเอียดสินค้าเบื้องต้นให้น่าสนใจ..." 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                required 
                                rows="4"
                                className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-medium focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm resize-none" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Code</label>
                                <input 
                                    type="text" 
                                    placeholder="JMN-12345" 
                                    value={sku} 
                                    onChange={e => setSku(e.target.value)} 
                                    required 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-mono focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                                <input 
                                    type="text" 
                                    placeholder="New, Sale, Gaming" 
                                    value={tags} 
                                    onChange={e => setTags(e.target.value)} 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    value={stock} 
                                    onChange={e => setStock(e.target.value)} 
                                    min="0" 
                                    required 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (฿)</label>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={price} 
                                    onChange={e => setPrice(e.target.value)} 
                                    required 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-purple-700 text-sm font-black focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-sm" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                <input 
                                    type="text"
                                    list="categories-list"
                                    placeholder="พิมพ์หรือเลือกหมวดหมู่..."
                                    value={category} 
                                    onChange={e => setCategory(e.target.value)} 
                                    required
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none shadow-sm"
                                />
                                <datalist id="categories-list">
                                    {(categoriesList || []).map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                <select 
                                    value={status} 
                                    onChange={e => setStatus(e.target.value)} 
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer shadow-sm"
                                >
                                    <option value={PRODUCT_STATUS.ACTIVE}>Active</option>
                                    <option value={PRODUCT_STATUS.INACTIVE}>Inactive</option>
                                    <option value={PRODUCT_STATUS.DRAFT}>Draft</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group w-max">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={isFeatured} 
                                        onChange={e => setIsFeatured(e.target.checked)} 
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-6 rounded-full transition-colors ${isFeatured ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-purple-600 transition-colors">สินค้าแนะนำ (Featured)</span>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={`w-full py-5 rounded-[24px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                            isSubmitting 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-200 hover:-translate-y-1'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                กำลังบันทึกข้อมูล...
                            </>
                        ) : (
                            <>บันทึกสินค้าลงฐานข้อมูล 🚀</>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
