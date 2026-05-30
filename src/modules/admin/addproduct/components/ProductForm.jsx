import ImageUploadBox from './ImageUploadBox';
import SpecFields from './SpecFields';
import { useAddProduct } from '../hooks/useAddProduct';

/**
 * 📦 ProductForm (Dumb/Presentational Component)
 * ทำหน้าที่แสดงผล UI เท่านั้น โดยรับ Logic และ State ทั้งหมดมาจาก useAddProduct Hook
 */
const ProductForm = () => {
    // 🎣 ดึง Logic และ State ทั้งหมดออกมาจาก Hook
    const {
        modelName, setModelName,
        description, setDescription,
        sku, setSku,
        tags, setTags,
        stock, setStock,
        regularPrice, setRegularPrice,
        category, setCategory,
        imagePreview,
        specifications,
        isSubmitting,
        handleFileSelect,
        handleSpecChange,
        handleSubmit
    } = useAddProduct();

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-purple-100">
            <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-purple-600 text-white p-2 rounded-xl text-lg">📦</span>
                เพิ่มสินค้าใหม่ลงระบบ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. คอมโพเนนต์กล่องอัปโหลดรูปภาพ - ตกแต่งให้ดูพรีเมียมขึ้น */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-purple-200">
                    <ImageUploadBox imagePreview={imagePreview} onFileSelect={handleFileSelect} />
                </div>

                {/* โซนกรอกข้อมูลทั่วไป */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Product Name</label>
                        <input 
                            type="text" 
                            placeholder="เช่น CORSAIR K70 RGB PRO..." 
                            value={modelName} 
                            onChange={e => setModelName(e.target.value)} 
                            required 
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm" 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Product Description</label>
                        <textarea 
                            placeholder="ระบุรายละเอียดสินค้าเบื้องต้นให้น่าสนใจ..." 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            required 
                            rows="3"
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm resize-none" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">SKU / Code</label>
                            <input 
                                type="text" 
                                placeholder="JMN-12345" 
                                value={sku} 
                                onChange={e => setSku(e.target.value)} 
                                required 
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tags (Comma separated)</label>
                            <input 
                                type="text" 
                                placeholder="New, Sale, Gaming" 
                                value={tags} 
                                onChange={e => setTags(e.target.value)} 
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all shadow-sm" 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Stock Quantity</label>
                            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <span className="pl-4 text-xs text-gray-400">🔢</span>
                                <input 
                                    type="number" 
                                    value={stock} 
                                    onChange={e => setStock(e.target.value)} 
                                    min="0" 
                                    required 
                                    className="w-full p-3.5 bg-transparent text-gray-800 text-sm focus:outline-none" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Regular Price (฿)</label>
                            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <span className="pl-4 text-xs text-gray-400 font-bold">฿</span>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={regularPrice} 
                                    onChange={e => setRegularPrice(e.target.value)} 
                                    required 
                                    className="w-full p-3.5 bg-transparent text-gray-800 text-sm focus:outline-none" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* แถบเลือกหมวดหมู่สินค้า - ตกแต่งให้เด่นขึ้น */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-600 uppercase ml-1 flex items-center gap-1">
                        Select Category <span className="animate-bounce">👇</span>
                    </label>
                    <div className="p-1 bg-purple-50 rounded-2xl border border-purple-100 shadow-inner">
                        <select 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            className="w-full p-3 bg-white rounded-xl border-none text-gray-800 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer appearance-none text-center"
                        >
                            {['Keyboard', 'CPU', 'Monitor', 'Notebook', 'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. คอมโพเนนต์ช่องกรอกคุณสมบัติสินค้าตามหมวดหมู่ - กั้นด้วยเส้นแบ่งสวยๆ */}
                <div className="pt-4 border-t border-gray-100">
                    <SpecFields 
                        category={category} 
                        specifications={specifications} 
                        onSpecChange={handleSpecChange} 
                    />
                </div>

                {/* ปุ่มกดส่งข้อมูล - ตกแต่งให้มีความวาวและเอฟเฟกต์สีสัน */}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                        isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-200'
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            กำลังบันทึกข้อมูล...
                        </span>
                    ) : 'บันทึกสินค้าลงฐานข้อมูล 🚀'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
