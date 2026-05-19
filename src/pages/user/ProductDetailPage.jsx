import  { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // 📥 Import useLocation เพิ่มเข้ามา

import ProductMainInfo from '../../components/features/productDetail/ProductMainInfo';
import ProductTabs from '../../components/features/productDetail/ProductTabs';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // 🌟 เครื่องมือสำหรับดักจับข้อมูลที่ส่งต่อมาจากหน้า Category
  const location = useLocation(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // เปิดเช็กดูว่ามีข้อมูลถูกแชร์ส่งข้ามหน้ามาด้วยไหม
    const sharedProductData = location.state?.productData;

    if (sharedProductData) {
      // 🎯 ถ้ามีข้อมูลส่งมาจากหน้าหมวดหมู่ ให้เอาข้อมูลชิ้นนั้นมาตั้งค่าโชว์บนจอทันที!
      setProduct(sharedProductData);
      setLoading(false);
    } else {
      // 💡 เคสกรณีที่ผู้ใช้พิมพ์ URL เข้ามาตรงๆ (ไม่ได้กดมาจากหน้า Category) 
      // ในอนาคตเราจะเอาไว้ใส่ฟังก์ชันยิง API ดึงข้อมูลจากหลังบ้านจริงตรงนี้ครับ
      
      console.log("ไม่มีข้อมูลส่งมาใน State ต้องยิง API ขอข้อมูลของ ID:", productId);
      setLoading(false);
    }
  }, [productId, location.state]);

  if (loading) {
    return <div className="w-full text-center py-20 text-xs text-gray-400 font-semibold">กำลังโหลดข้อมูล...</div>;
  }

  if (!product) {
    return (
      <div className="w-full text-center py-20 text-gray-500 text-sm flex flex-col items-center gap-3">
        <p>❌ ไม่พบข้อมูลสินค้า (กรุณากดเข้าผ่านหน้ารวมสินค้า)</p>
        <button onClick={() => navigate(-1)} className="bg-purple-600 text-white text-xs px-4 py-2 rounded-lg font-bold">ย้อนกลับ</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50 py-8 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
        
        <button onClick={() => navigate(-1)} className="text-xs text-purple-600 font-extrabold flex items-center gap-1 w-fit hover:underline">
          ← ย้อนกลับหน้ารวมสินค้า
        </button>

        {/* ข้อมูลจะเปลี่ยนตามตัวสินค้าที่ถูกกดส่งมาแบบ Dynamic 100% */}
        <ProductMainInfo product={product} />
        <ProductTabs product={product} /> 

      </div>
    </div>
  );
};

export default ProductDetailPage;