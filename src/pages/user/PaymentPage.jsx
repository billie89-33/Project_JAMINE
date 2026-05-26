import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Navbar } from '@/shared/components'; 
import { 
  PaymentStepper, 
  PromptPayQRBox, 
  CheckoutItemsList, 
  OrderSummaryCard 
} from '@/modules/payment';

/**
 * 📲 PaymentPage
 * หน้าแสดง QR Code สำหรับชำระเงินผ่าน PromptPay
 */
const PaymentPage = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  // 🧪 รายชื่อสินค้าจำลอง (ในอนาคตดึงจาก LocalStorage หรือ State ที่ส่งมาจาก Checkout)
  const [cartItems] = useState(JSON.parse(localStorage.getItem('cart')) || [
    { id: 'p1', name: 'Product name', price: 300, quantity: 1, image: 'https://via.placeholder.com/150' },
    { id: 'p2', name: 'Product name', price: 300, quantity: 1, image: 'https://via.placeholder.com/150' }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const payableAmount = subtotal; // ปรับให้ตรงกับราคาสินค้าจริงในตะกร้า

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    try {
      // จำลองการตรวจสอบ
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("ระบบได้รับยอดโอนของท่านเรียบร้อยแล้ว!");
      localStorage.removeItem('cart'); // ล้างตะกร้าหลังจ่ายเงินสำเร็จ
      navigate('/'); // กลับไปหน้าแรก หรือหน้าขอบคุณ
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50 text-sm font-medium text-gray-700">
      
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200/50 pb-4">
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => navigate(-1)} 
              className="text-xs text-purple-600 font-extrabold flex items-center gap-1 w-fit hover:underline cursor-pointer"
            >
              ← Return to gallery
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight mt-1">Secure Checkout</h1>
            <p className="text-[11px] text-gray-400 max-w-sm leading-relaxed">
              Complete your digital acquisition through our encrypted PromptPay gateway.
            </p>
          </div>
          
          <PaymentStepper currentStep={2} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-2">
          
          <div className="md:col-span-2">
            <PromptPayQRBox totalAmount={payableAmount} />
          </div>

          <div className="flex flex-col gap-6 sticky top-6">
            <CheckoutItemsList cartItems={cartItems} />
            
            <OrderSummaryCard 
              subtotal={subtotal} 
              shipping={0}
              discount={0}
              total={subtotal}
              buttonText="Verify Payment" 
              onAction={handleVerifyPayment} 
              isSubmitting={isVerifying}
              isDisabled={cartItems.length === 0}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
