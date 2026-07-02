import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProductMainInfo, ProductTabs, useProductDetail } from '@/modules/product-detail';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🎣 ใช้ Custom Hook ที่เราแยกออกมา (Business Logic)
  // หมายเหตุ: ในตอนนี้เรายังรองรับการรับข้อมูลจาก location.state เพื่อความเร็ว
  const { product: apiProduct, loading: apiLoading } = useProductDetail(productId as string);
  
  const sharedProductData = location.state?.productData;
  const product = sharedProductData || apiProduct;
  const loading = sharedProductData ? false : apiLoading;

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
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50 py-8 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
        
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
