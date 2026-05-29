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
        name, setName,
        sku, setSku,
        tags, setTags,
        quantity, setQuantity,
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
        <div className="w-full max-w-xl mx-auto bg-[#A3A3A3] p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. คอมโพเนนต์กล่องอัปโหลดรูปภาพ */}
                <ImageUploadBox imagePreview={imagePreview} onFileSelect={handleFileSelect} />

                {/* โซนกรอกข้อมูลทั่วไป */}
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="Product name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" 
                    />
                    <input 
                        type="text" 
                        placeholder="Product Code" 
                        value={sku} 
                        onChange={e => setSku(e.target.value)} 
                        required 
                        className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" 
                    />
                    <input 
                        type="text" 
                        placeholder="Tags" 
                        value={tags} 
                        onChange={e => setTags(e.target.value)} 
                        className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" 
                    />
                    
                    <div className="w-full p-3 bg-[#E5E5E5] rounded-md flex items-center justify-between text-sm text-gray-600">
                        <span>Quantity</span>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={e => setQuantity(e.target.value)} 
                            min="1" 
                            required 
                            className="w-20 p-1 bg-white border border-gray-300 rounded text-center text-gray-800" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="number" 
                            placeholder="Regular Price" 
                            value={regularPrice} 
                            onChange={e => setRegularPrice(e.target.value)} 
                            required 
                            className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" 
                        />
                        <input 
                            type="number" 
                            placeholder="Sales Price" 
                            disabled 
                            className="w-full p-3 bg-[#E5E5E5] placeholder-gray-400 rounded-md border-none cursor-not-allowed text-sm" 
                        />
                    </div>
                </div>

                {/* แถบเลือกหมวดหมู่สินค้า */}
                <div className="grid grid-cols-2 gap-4 items-center bg-[#E5E5E5] p-2 rounded-md">
                    <span className="text-sm font-medium text-gray-700 pl-2">Category 📁</span>
                    <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        className="w-full p-2 bg-white rounded border border-gray-300 text-gray-800 text-sm focus:outline-none"
                    >
                        {['Keyboard', 'CPU', 'Monitor', 'Notebook', 'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* 2. คอมโพเนนต์ช่องกรอกคุณสมบัติสินค้าตามหมวดหมู่ */}
                <SpecFields 
                    category={category} 
                    specifications={specifications} 
                    onSpecChange={handleSpecChange} 
                />

                {/* ปุ่มกดส่งข้อมูล */}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full py-3 rounded-md text-white font-bold text-sm shadow transition-colors ${
                        isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#3A3D52] hover:bg-[#2A2C3D]'
                    }`}
                >
                    {isSubmitting ? 'กำลังบันทึกสินค้า...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
