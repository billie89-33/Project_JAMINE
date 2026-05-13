import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockBanners = [
    { id: 1, imageUrl: 'unsplash.com' },
    { id: 2, imageUrl: 'unsplash.com' },
    { id: 3, imageUrl: 'unsplash.com' }
  ];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === mockBanners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[350px] rounded-lg overflow-hidden group bg-purple-100 flex items-center justify-center border-2 border-purple-500 shadow-md">
      
      {/* 1. รูปภาพแบนเนอร์ปัจจุบัน */}
      <img
        src={mockBanners[currentIndex].imageUrl}
        alt={`Banner ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
        onError={(e) => { 
          e.target.src = 'placehold.co'; 
        }}
      />

      {/* 2. ปุ่มลูกศรซ้าย-ขวา ธีมม่วงสดใสสะดุดตา */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-white/95 rounded-full shadow-lg border border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-purple-400/50 hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 scale-100 hover:scale-110"
      >
        <ChevronLeft size={20} className="stroke-[2.5]" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-white/95 rounded-full shadow-lg border border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-purple-400/50 hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 scale-100 hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
};

export default HeroBanner;