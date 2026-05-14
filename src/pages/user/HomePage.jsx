import HeroBanner from '../../components/features/Home/01_HeroBanner';
import CategorySlider from '../../components/features/Home/02_CategorySlider';
import PromotionBanner from '../../components/features/Home/03_PromotionBanner';
import ProductGrid from '../../components/features/Home/04_ProductGrid';
import SidebarNews from '../../components/features/Home/04._SidebarNews';


const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-12">
    
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