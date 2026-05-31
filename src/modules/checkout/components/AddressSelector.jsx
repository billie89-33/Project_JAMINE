import React, { useState } from 'react';
import { Plus, Trash2, MapPin, X, Home, Briefcase, CheckCircle2 } from 'lucide-react';

const AddressSelector = ({ addresses, selectedAddressId, onSelectAddress, onAddAddress, onDeleteAddress }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    phone: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.fullName || !formData.phone || !formData.address || !formData.postalCode) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    onAddAddress(formData);
    setFormData({ name: '', fullName: '', phone: '', address: '', subDistrict: '', district: '', province: '', postalCode: '' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-xl shadow-purple-100/20 flex flex-col gap-6">
      
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <MapPin size={20} className="text-purple-600" />
          Delivery Address
        </h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={3} />
            Add New
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === (addr._id || addr.id);
          return (
            <label 
              key={addr._id || addr.id} 
              className={`group flex items-start gap-4 p-5 border-2 rounded-[24px] cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-purple-600 bg-purple-50/30 shadow-lg shadow-purple-100/50' 
                  : 'border-slate-50 hover:border-slate-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={isSelected}
                onChange={() => onSelectAddress(addr._id || addr.id)}
                className="hidden"
              />
              
              {/* Custom Radio Indicator */}
              <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-200 bg-white group-hover:border-purple-300'
              }`}>
                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>

              <div className="flex-1 flex justify-between items-start">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-900 text-xs uppercase tracking-wide truncate">
                      {addr.name}
                    </span>
                    {isSelected && (
                      <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold mb-1">
                    Recipient: <span className="text-slate-700">{addr.fullName || 'Not specified'}</span> | Tel: {addr.phone || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {addr.address} {addr.subDistrict} {addr.district} {addr.province} {addr.postalCode}
                  </p>
                </div>

                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm("คุณต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
                      onDeleteAddress(addr._id || addr.id);
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </label>
          );
        })}
      </div>

      {/* 📝 Inline Expansion Form */}
      {isAdding && (
        <div className="mt-2 p-6 md:p-8 bg-slate-50 rounded-[32px] border border-slate-100 animate-in slide-in-from-top-4 duration-500 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">New Location Details</h4>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Name (Home/Office) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location Label</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="e.g. Home, Office"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Full Name</label>
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange}
                placeholder="Name - Surname"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange}
                placeholder="081-XXX-XXXX"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Postal Code</label>
              <input 
                name="postalCode" 
                value={formData.postalCode} 
                onChange={handleInputChange}
                placeholder="10XXX"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Sub-district */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sub-district</label>
              <input 
                name="subDistrict" 
                value={formData.subDistrict} 
                onChange={handleInputChange}
                placeholder="Tambon"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">District</label>
              <input 
                name="district" 
                value={formData.district} 
                onChange={handleInputChange}
                placeholder="Amphoe"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

             {/* Province */}
             <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Province</label>
              <input 
                name="province" 
                value={formData.province} 
                onChange={handleInputChange}
                placeholder="Province"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* Full Address Details */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Street Address / House No.</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange}
                rows="2"
                placeholder="House number, Building, Street..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {!isAdding && addresses.length === 0 && (
        <div className="py-12 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
            <MapPin size={32} strokeWidth={1.5} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] max-w-[200px]">
            No delivery addresses found. Please add one to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
