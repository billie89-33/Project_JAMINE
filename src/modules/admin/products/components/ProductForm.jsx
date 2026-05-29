import  { useState, useEffect } from 'react';
import ImageUploadBox from './ImageUploadBox';
import SpecFields from './SpecFields';
import { createProductApi } from '../services/adminApi'; // ⚠️ ตรวจสอบพาธไฟล์ service ของคุณด้วยนะครับ

const ProductForm = () => {
    // 💾 State ข้อมูลทั่วไป
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [regularPrice, setRegularPrice] = useState('');
    const [category, setCategory] = useState('Keyboard');

    // 💾 State คุมข้อมูลไฟล์ภาพ
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 💾 State คุม Specs ย่อยเฉพาะหมวดหมู่
    const [specifications, setSpecifications] = useState({});

    // 🔄 รีเซ็ตช่องกรอก Specs เป็นค่าว่างทันทีเมื่อมีการคลิกเปลี่ยนหมวดหมู่สินค้า
    useEffect(() => {
        setSpecifications({});
    }, [category]);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file)); // สร้างลิงก์ Preview ภาพบนจอ
    };

    const handleSpecChange = (key, value) => {
        setSpecifications(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            return alert('กรุณาเลือกรูปภาพสินค้าก่อนกดบันทึกครับ');
        }
        
        setIsSubmitting(true);

        try {
            // 💡 บรรจุของทั้งหมดลง FormData เพื่อส่งไฟล์ดิบไปพร้อมข้อมูลหนังสือ
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('brand', specifications['Brand'] || 'Unknown');
            formData.append('modelName', name);
            formData.append('price', Number(regularPrice));
            formData.append('sku', sku);
            formData.append('category', category);
            formData.append('stock', Number(quantity));
            formData.append('tags', tags);
            
            // ⚠️ สำคัญมาก: แปลงก้อน Object specifications ให้กลายเป็น String JSON ส่งไปให้หลังบ้านรอนำไป Parse
            formData.append('specifications', JSON.stringify(specifications));

            const result = await createProductApi(formData);
            
            if (result.success) {
                alert('เพิ่มสินค้าใหม่ลงระบบสำเร็จเรียบร้อยแล้ว!');
                // 🧹 เคลียร์ฟอร์มกลับเป็นค่าว่างเพื่อเตรียมกรอกชิ้นถัดไป
                setName(''); setSku(''); setTags(''); setQuantity(1); setRegularPrice('');
                setSelectedFile(null); setImagePreview(null); setCategory('Keyboard');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto bg-[#A3A3A3] p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. คอมโพเนนต์กล่องอัปโหลดรูปภาพ */}
                <ImageUploadBox imagePreview={imagePreview} onFileSelect={handleFileSelect} />

                {/* โซนกรอกข้อมูลทั่วไป */}
                <div className="space-y-3">
                    <input type="text" placeholder="Product name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" />
                    <input type="text" placeholder="Product Code" value={sku} onChange={e => setSku(e.target.value)} required className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" />
                    <input type="text" placeholder="Tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" />
                    
                    <div className="w-full p-3 bg-[#E5E5E5] rounded-md flex items-center justify-between text-sm text-gray-600">
                        <span>Quantity</span>
                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" required className="w-20 p-1 bg-white border border-gray-300 rounded text-center text-gray-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Regular Price" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} required className="w-full p-3 bg-[#E5E5E5] placeholder-gray-500 rounded-md border-none text-gray-800 text-sm focus:outline-none" />
                        <input type="number" placeholder="Sales Price" disabled className="w-full p-3 bg-[#E5E5E5] placeholder-gray-400 rounded-md border-none cursor-not-allowed text-sm" />
                    </div>
                </div>

                {/* แถบเลือกหมวดหมู่สินค้า */}
                <div className="grid grid-cols-2 gap-4 items-center bg-[#E5E5E5] p-2 rounded-md">
                    <span className="text-sm font-medium text-gray-700 pl-2">Category 📁</span>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 bg-white rounded border border-gray-300 text-gray-800 text-sm focus:outline-none">
                        {['Keyboard', 'CPU', 'Monitor', 'Notebook', 'Gaming Mouse'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* 2. คอมโพเนนต์ช่องกรอกคุณสมบัติสินค้าตามหมวดหมู่ */}
                <SpecFields category={category} specifications={specifications} onSpecChange={handleSpecChange} />

                {/* ปุ่มกดส่งข้อมูล */}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full py-3 rounded-md text-white font-bold text-sm shadow transition-colors ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#3A3D52] hover:bg-[#2A2C3D]'}`}
                >
                    {isSubmitting ? 'กำลังบันทึกสินค้า...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;