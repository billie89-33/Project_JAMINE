import React from 'react';

const PaymentStepper = ({ currentStep = 2 }) => {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-full shadow-sm w-fit select-none">
      
      {/* 🔴 สเต็ปที่ 1: รายละเอียด */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
        currentStep === 1 
          ? 'bg-red-600 text-white shadow-sm shadow-red-100 scale-105' 
          : 'bg-gray-100 text-gray-500'
      }`}>
        <span>1. รายละเอียด</span>
      </div>

      {/* ➖ เส้นเชื่อมโยงระหว่างสเต็ปตามรูปภาพดีไซน์ */}
      <div className="w-6 h-[2px] bg-gray-200 rounded"></div>

      {/* 🔴 สเต็ปที่ 2: ชำระเงิน */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
        currentStep === 2 
          ? 'bg-red-600 text-white shadow-sm shadow-red-100 scale-105' 
          : 'bg-gray-100 text-gray-400'
      }`}>
        <span>2. ชำระเงิน</span>
      </div>

    </div>
  );
};

export default PaymentStepper;
