

const PromotionBanner = () => {
  // เปลี่ยนเป็นภาพม็อคอัพโทนสีม่วงนีออนสดใสสะดุดตา
  const mockPromotionImageUrl = 'unsplash.com';

  return (
    <div className="w-full h-[150px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg shadow-md bg-purple-50 border-2 border-purple-400 hover:border-purple-600 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 cursor-pointer">
      <img
        src={mockPromotionImageUrl}
        alt="Summer Splash Promotion"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'unsplash.com';
        }}
      />
    </div>
  );
};

export default PromotionBanner;