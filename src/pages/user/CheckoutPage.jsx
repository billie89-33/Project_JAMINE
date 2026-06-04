
import { useNavigate } from 'react-router-dom';
import { 
  AddressSelector, 
  PaymentMethodSelector, 
  CheckoutItemsList, 
  OrderSummaryCard,
  useCheckout 
} from '@/modules/checkout';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  const {
    cartItems,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    paymentMethod,
    priceDetails,
    loading,
    isSubmitting,
    submitOrder,
    addAddress,
    deleteAddress
  } = useCheckout();

  if (loading) {
    return (
      <div className="w-full text-center py-20 text-xs text-purple-600 font-bold">
        กำลังตรวจสอบข้อมูลคำสั่งซื้อ...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-slate-50 py-8 text-sm font-medium text-gray-700">
      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6">
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs text-purple-600 font-extrabold flex items-center gap-1 w-fit hover:underline cursor-pointer"
        >
          ← Return to cart
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          <div className="md:col-span-2 flex flex-col gap-6">
            <AddressSelector 
              addresses={addresses} 
              selectedAddressId={selectedAddressId} 
              onSelectAddress={setSelectedAddressId}
              onAddAddress={addAddress}
              onDeleteAddress={deleteAddress}
            />
            <PaymentMethodSelector paymentMethod={paymentMethod} />
          </div>

          <div className="flex flex-col gap-6 sticky top-6">
            <CheckoutItemsList cartItems={cartItems} />
            
            <OrderSummaryCard 
              subtotal={priceDetails.subtotal}
              shipping={priceDetails.shipping}
              discount={priceDetails.discount}
              total={priceDetails.total}
              buttonText="Checkout"
              onAction={submitOrder}
              isSubmitting={isSubmitting}
              isDisabled={cartItems.length === 0}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
