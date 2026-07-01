import React from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Mail, User as UserIcon, Lock, ShieldCheck } from 'lucide-react';

const PersonalInfoForm: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50 space-y-10">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
         <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
           <UserIcon size={20} />
         </div>
         <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
               <ShieldCheck size={14} />
            </div>
            <input 
              type="text" 
              value={user?.username} 
              disabled 
              className="w-full bg-slate-50 border border-slate-100 px-10 py-4 text-sm rounded-2xl font-bold text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
               <Mail size={14} />
            </div>
            <input 
              type="email" 
              value={user?.email} 
              disabled 
              className="w-full bg-slate-50 border border-slate-100 px-10 py-4 text-sm rounded-2xl font-bold text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 space-y-6">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Security Settings</h4>
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-600 transition-all active:scale-95 shadow-lg shadow-slate-100">
          <Lock size={14} />
          Change Password
        </button>
      </div>

      <div className="bg-purple-50 p-6 rounded-[24px] border border-purple-100">
         <p className="text-[10px] text-purple-600 font-bold leading-relaxed uppercase tracking-wide">
           Note: To change your username or email, please contact our administrative team via the support desk.
         </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
