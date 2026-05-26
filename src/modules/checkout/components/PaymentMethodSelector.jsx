import React from 'react';

const PaymentMethodSelector = ({ paymentMethod }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4">
      <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider mb-1">Choose payment method</h3>
      
      <label className="flex items-center gap-4 p-3.5 border border-purple-600 bg-purple-50/20 rounded-xl cursor-pointer shadow-sm ring-1 ring-purple-100">
        <input
          type="radio"
          name="payment"
          checked={paymentMethod === 'promptpay'}
          readOnly
          className="accent-purple-600 w-4 h-4 cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-gray-900 text-xs">Promptpay</span>
          <span className="text-[10px] text-gray-400 mt-0.5">สแกนจ่ายผ่าน QR Code ทุกธนาคาร ไม่มีค่าธรรมเนียม</span>
        </div>
      </label>
    </div>
  );
};

export default PaymentMethodSelector;
