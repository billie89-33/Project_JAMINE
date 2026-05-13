import HeroBanner from '../../components/Home/01_HeroBanner';
import CategorySlider from '../../components/Home/02_CategorySlider';


const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-12">
      {/* 1. ส่วนแบนเนอร์สไลเดอร์รูปใหญ่ (มีระบบรอโหลด API) */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <HeroBanner />
      </div>

  
      
     <div className="max-w-7xl mx-auto px-4 mt-8">
       <CategorySlider />
      </div>

      
       
    </div>
  );
};

export default HomePage;