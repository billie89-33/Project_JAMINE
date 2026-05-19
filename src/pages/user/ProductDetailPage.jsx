import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 📥 Import Components ย่อยที่เราแยกสัดส่วนไว้มาประกอบร่าง
import ProductMainInfo from '../../components/features/productDetail/ProductMainInfo';
import ProductTabs from '../../components/features/productDetail/ProductTabs';

const ProductDetailPage = () => {
  const { productId } = useParams(); // แกะไอดีจาก URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 เมื่อต่อกับระบบหลังบ้านจริง ให้สลับมาใช้โค้ดชุดนี้แทนได้เลย:
    /*
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${productId}`) // หรือ URL API ของคุณ
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product data:", err);
        setLoading(false);
      });
    */

    // 📦 ชุด Mock Data ตัวเต็มที่โครงสร้างแกะมาจากตัวแปร JSON ในโปรเจกต์ของคุณเป๊ะๆ
    const mockDataFromAPI = {
      _id: "663a1b5c8f1a2b3c4d5e6f7a",
      name: "CPU (ซีพียู) AMD AM4 RYZEN 5 5600 3.5GHz 6C 12T",
      description: "รายละเอียดสินค้าซีพียู AMD Ryzen 5 5600 พร้อมระบบระบายความร้อน Stealth",
      category: "CPU",
      price: 4390,
      quantity: 15,
      images: [
        "https://unsplash.com", // รูปหลักตัวอย่าง
        "https://unsplash.com"
      ],
      specifications: {
        "Brand": "AMD",
        "Series": "5000 Series",
        "Processor Number": "Ryzen 5 5600",
        "Socket Type": "AM4",
        "Cores/Threads": "6 Cores / 12 Threads",
        "Base Frequency": "3.5 GHz",
        "Max Turbo Frequency": "4.4 GHz",
        "L2 Cache": "3 MB",
        "L3 Cache": "32 MB",
        "Graphics Models": "Discrete Graphics Card Required",
        "64-Bit Support": "YES",
        "CPU Cooler": "YES",
        "Default TDP": "65W",
        "Warranty": "3 Years"
      },
      createdAt: "2024-05-08T10:00:00.000Z",
      updatedAt: "2024-05-08T10:00:00.000Z"
    };

    setProduct(mockDataFromAPI);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return <div className="w-full text-center py-20 text-sm text-gray-400 font-semibold">กำลังดึงข้อมูลสินค้าจากระบบ...</div>;
  }

  if (!product) {
    return (
      <div className="w-full text-center py-20 text-gray-500 text-sm flex flex-col items-center gap-3">
        <p>❌ ไม่พบข้อมูลสินค้าชิ้นนี้ในระบบ</p>
        <button onClick={() => navigate(-1)} className="bg-purple-600 text-white text-xs px-4 py-2 rounded-lg font-bold">ย้อนกลับ</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50 py-8 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
        
        {/* ปุ่มย้อนกลับด้านบนสุด */}
        <button onClick={() => navigate(-1)} className="text-xs text-purple-600 font-extrabold flex items-center gap-1 w-fit hover:underline">
          ← ย้อนกลับหน้ารวมสินค้า
        </button>

        
        <ProductMainInfo product={product} />

       
        <ProductTabs product={product} /> 

      </div>
    </div>
  );
};

export default ProductDetailPage;