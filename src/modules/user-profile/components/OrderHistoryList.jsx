
import { ShoppingBag, Search, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';

const OrderHistoryList = () => {
  const mockOrders = []; // TODO: Integrate with orders API

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={10} /> Paid</span>;
      case 'Awaiting Payment':
        return <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100"><Clock size={10} /> Pending</span>;
      case 'Cancelled':
        return <span className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100"><XCircle size={10} /> Cancelled</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8 mb-8">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
               <ShoppingBag size={20} />
             </div>
             <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Order History</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Track and manage your purchases</p>
             </div>
           </div>

           <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors">
                <Search size={14} />
              </div>
              <input 
                type="text" 
                placeholder="Search orders..."
                className="w-full md:w-64 bg-slate-50 border border-slate-100 px-10 py-3 text-xs rounded-2xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-bold placeholder:text-slate-300"
              />
           </div>
        </div>

        {mockOrders.length > 0 ? (
          <div className="space-y-4">
             {/* Order cards would go here */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 text-slate-200 border-2 border-dashed border-slate-100">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight">No orders yet</h4>
            <p className="text-slate-400 text-xs font-bold max-w-[250px] leading-relaxed mb-8">
              Looks like you haven't placed any orders yet. Start shopping to fill this list!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-200 hover:scale-105 transition-all active:scale-95">
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryList;
