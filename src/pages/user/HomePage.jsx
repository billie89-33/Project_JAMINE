import HeroBanner from '../../components/features/Home/HeroBanner';
import CategorySlider from '../../components/common/CategorySlider/CategorySlider';
import PromotionBanner from '../../components/features/Home/PromotionBanner';
import ProductGrid from '../../components/features/Home/ProductGrid';
import SidebarNews from '../../components/features/Home/SidebarNews';


const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50 pb-10">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <HeroBanner />
      </div>

  
      
     <div className="max-w-7xl mx-auto px-4 mt-8">
       <CategorySlider />
      </div>

      {/* 3. ส่วนสินค้ามาใหม่ (Product Cards) */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <PromotionBanner />
      </div>

      
       {/* ส่วนโครงสร้างกริดจัดวางสินค้าและข่าวสาร */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductGrid />
        </div>
        <div className="lg:col-span-1">
          <SidebarNews />
        </div>
      </div>
      
       
    </div>
  );
};

export default HomePage;