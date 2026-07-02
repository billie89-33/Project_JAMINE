import React, { useState, useEffect } from 'react';
import generatePayload from 'promptpay-qr';
import QRCodeComp from 'react-qr-code'; 

// 🛡️ Fix for potential CJS/ESM interop issues with react-qr-code
const QRCode = (QRCodeComp as { default?: typeof QRCodeComp }).default || QRCodeComp;

interface PromptPayQRBoxProps {
  totalAmount?: number;
}

const PromptPayQRBox: React.FC<PromptPayQRBoxProps> = ({ totalAmount = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const targetPromptPayId = "0641199580"; 
  const promptPayTextPayload = generatePayload(targetPromptPayId, { amount: totalAmount });

  return (
    <div className="bg-purple-50/40 rounded-3xl border border-purple-100 p-8 flex flex-col items-center gap-5 shadow-sm w-full">
      
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-wider text-slate-700 select-none">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
        PromptPay Payment
      </div>

      <div className="text-center flex flex-col gap-1">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Total Payable</span>
        <h2 className="text-2xl font-black text-purple-600">
          ฿{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-md max-w-[260px] w-full aspect-square flex flex-col items-center justify-center relative group">
        <div className="absolute top-2 text-[8px] font-extrabold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 tracking-wider select-none">
          SAFE THE WORK
        </div>
        
        <div className="w-full h-full mt-4 flex items-center justify-center p-2">
          <QRCode 
            value={promptPayTextPayload} 
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 200 200`}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-1 select-none">
        <p className="text-[11px] text-gray-400 font-bold">Scan to pay with any banking app</p>
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-[9px] bg-white border border-gray-100 shadow-sm text-slate-500 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
            ✦ Instant Verification
          </span>
          <span className="text-[9px] bg-white border border-gray-100 shadow-sm text-slate-400 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
            🛡️ Secure Gateway
          </span>
        </div>
      </div>

      <div className="w-full flex justify-between items-center pt-4 border-t border-purple-100/50 text-[10px] text-gray-400 font-bold mt-2">
        <span className="flex items-center gap-1 text-red-500/80">
          ⏳ Session expires in {formatTime(timeLeft)}
        </span>
        <div className="flex gap-3 text-purple-600/70">
          <button type="button" className="hover:text-purple-600 hover:underline cursor-pointer">Download QR</button>
          <span>•</span>
          <button type="button" className="hover:text-purple-600 hover:underline cursor-pointer">Report Issue</button>
        </div>
      </div>

    </div>
  );
};

export default PromptPayQRBox;
