

export default function CartSummary({ subtotal }) {
  return (
    <div className="w-full lg:w-96 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-50 pb-3">Cart Summary</h2>
      
      <div className="space-y-4 text-sm text-gray-600 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">฿{subtotal.toLocaleString()}.-</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-500 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-bold text-gray-800">
          <span>Total</span>
          <span className="text-xl text-indigo-600">฿{subtotal.toLocaleString()}.-</span>
        </div>
      </div>

      <button className="w-full bg-indigo-600 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-[0.98]">
        Proceed to Checkout
      </button>
    </div>
  );
}