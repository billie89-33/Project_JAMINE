import DashboardModule from '@/modules/admin/dashboard';

/**
 * 🚀 DashboardPage (Admin)
 * หน้าสรุปสถิติหลักแบบ Full-width สไตล์พรีเมียม ม่วงสดใส
 */
const DashboardPage = () => {
    return (
        <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-10 lg:p-12">
            <DashboardModule />
        </div>
    );
};

export default DashboardPage;
