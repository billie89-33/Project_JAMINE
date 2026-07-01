

import React from 'react';

interface OrderSummaryCardProps {
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  buttonText?: string;
  onAction?: () => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
}

/**
 * 📊 OrderSummaryCard (Shared Component)
 * มาตรฐานสรุปยอดเงิน (Financial Summary Standard - Doc 12)
 */
const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ 
  subtotal = 0, 
  shipping = 0, 
  discount = 0, 
  total = 0, 
  buttonText = "Checkout", 
  onAction, 
  isSubmitting = false,
  isDisabled = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
      {/* 🔄 Doc 12.4: Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center animate-in fade-in duration-200">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-2">Order summary</h3>
      
      <div className="flex flex-col gap-2 border-b border-gray-50 pb-4 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold">Subtotal</span>
          {/* ✨ Doc 12.4: Standard Formatting (.toLocaleString) */}
          <span className="font-black text-gray-900">฿{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold">Shipping</span>
          <span className={`font-black ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {shipping === 0 ? 'Free' : `฿${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span className="font-bold">Discount</span>
            <span className="font-black">-฿{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center py-1">
        <span className="text-xs font-extrabold text-gray-900">Total</span>
        <span className="text-base font-black text-purple-600">฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={isSubmitting || isDisabled}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-black py-4 rounded-xl transition-all shadow-md shadow-purple-100 uppercase tracking-wider cursor-pointer active:scale-98 text-center"
      >
        {isSubmitting ? 'Processing...' : buttonText}
      </button>
    </div>
  );
};

export default OrderSummaryCard;
