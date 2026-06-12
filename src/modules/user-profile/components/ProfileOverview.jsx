
import { useAuth } from '@/shared/contexts/AuthContext';
import { ShoppingBag, MapPin, Star, Clock } from 'lucide-react';

const ProfileOverview = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Orders', value: '0', icon: <ShoppingBag size={20} />, color: 'bg-blue-500' },
    { label: 'Addresses', value: user?.addresses?.length || '0', icon: <MapPin size={20} />, color: 'bg-purple-500' },
    { label: 'Reviews', value: '0', icon: <Star size={20} />, color: 'bg-amber-500' },
    { label: 'Pending', value: '0', icon: <Clock size={20} />, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10">
      {/* 👋 Welcome Header */}
      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50 flex items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-purple-100 transition-colors duration-700"></div>
        
        <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-purple-200">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        
        <div className="relative space-y-1">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome back, <span className="text-purple-600">{user?.username}</span>!
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Email: {user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>

      {/* 📊 Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-lg shadow-purple-100/20 border border-slate-50 flex flex-col gap-4 hover:translate-y-[-5px] transition-all duration-300 group">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-800 font-mono">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 📦 Recent Activity (Placeholder) */}
      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 pb-4 border-b border-slate-50">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Clock size={32} />
           </div>
           <p className="text-xs font-bold uppercase tracking-widest">No recent activity found</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
