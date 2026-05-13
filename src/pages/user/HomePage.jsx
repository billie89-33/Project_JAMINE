import HeroBanner from '../../components/Home/01_HeroBanner';
import CategorySlider from '../../components/Home/02_CategorySlider';
import PromotionBanner from '../../components/Home/03_PromotionBanner';
import ProductGrid from '../../components/Home/04_ProductGrid';
import SidebarNews from '../../components/Home/04._SidebarNews';

//import NewArrivals from '../../components/common/Home/03_NewArrivals';
//import MainGridSection from '../../components/common/Home/05_MainGridSection';
//import RelatedArticles from '../../components/common/Home/06_RelatedArticles';

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