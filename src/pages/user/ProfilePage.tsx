
import { 
  ProfileSidebar, 
  ProfileOverview, 
  PersonalInfoForm, 
  AddressBook, 
  OrderHistoryList, 
  useUserProfile 
} from '@/modules/user-profile';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 👤 ProfilePage (User View)
 * หน้ารวมศูนย์จัดการข้อมูลส่วนตัวของผู้ใช้
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { activeTab, handleTabChange } = useUserProfile();

  // 🧩 ฟังก์ชัน Render เนื้อหาตาม Tab ที่เลือก
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview />;
      case 'me':
        return <PersonalInfoForm />;
      case 'addresses':
        return <AddressBook />;
      case 'orders':
        return <OrderHistoryList />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔙 Navigation Header */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-purple-50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to Store</span>
          </button>

          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">My Account</h1>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em]">Jamine Premium Member</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* 🧭 Sidebar */}
          <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />

          {/* 🖼️ Dynamic Content Area */}
          <div className="flex-1 min-h-[600px] animate-in fade-in slide-in-from-right-4 duration-500">
             {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
