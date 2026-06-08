
import { AddressSelector } from '@/modules/checkout';
import { useCheckout } from '@/modules/checkout/hooks/useCheckout';
import { MapPin } from 'lucide-react';

const AddressBook = () => {
  // 🔄 Reuse the logic from checkout module since it's already robust
  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
  } = useCheckout();

  return (
    <div className="space-y-6">
      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-8">
           <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
             <MapPin size={20} />
           </div>
           <div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">My Address Book</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage your delivery locations</p>
           </div>
        </div>

        <AddressSelector 
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddAddress={addAddress}
          onUpdateAddress={updateAddress}
          onSetDefaultAddress={setDefaultAddress}
          onDeleteAddress={deleteAddress}
        />
      </div>
    </div>
  );
};

export default AddressBook;
