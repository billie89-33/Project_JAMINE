
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar'; 
import { 
  PaymentStepper, 
  PromptPayQRBox, 
  usePayment,
  OrderSummaryCard,
  CheckoutItemsList
} from '@/modules/payment';

/**
 * 📲 PaymentPage
 * หน้าแสดง QR Code สำหรับชำระเงินผ่าน PromptPay
 */
const PaymentPage = () => {
  const navigate = useNavigate();
  
  const {
    order,
    loading,
    isVerifying,
    verifyPayment
  } = usePayment();

  // 🔄 สภาวะโหลดข้อมูล (Security First)
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Verifying secure payment session...</p>
        </div>
      </div>
    );
  }

  // 🚨 ตรวจสอบกรณีดึงข้อมูลไม่สำเร็จ
  if (!order) return null;

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
              ← Return to checkout
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight mt-1">Finalize Acquisition</h1>
            <p className="text-[11px] text-gray-400 max-w-sm leading-relaxed">
              Scan QR code for Order <span className="text-slate-900 font-black">#{order._id || order.id}</span>
            </p>
          </div>
          
          <PaymentStepper currentStep={2} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-2">
          
          <div className="md:col-span-2">
            <PromptPayQRBox totalAmount={order.totalAmount} />
          </div>

          <div className="flex flex-col gap-6 sticky top-6">
            <CheckoutItemsList cartItems={order.items || []} />
            
            <OrderSummaryCard 
              subtotal={order.subtotal || (order.totalAmount - (order.shipping || order.shippingFee || 0))} 
              shipping={order.shipping || order.shippingFee || 0}
              discount={order.discount || 0}
              total={order.totalAmount}
              buttonText="Confirm Payment" 
              onAction={verifyPayment} 
              isSubmitting={isVerifying}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
