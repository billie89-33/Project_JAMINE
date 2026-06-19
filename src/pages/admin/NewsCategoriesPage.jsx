import { NewsCategoriesModule } from '@/modules/admin/news-categories';

/**
 * 🏷️ NewsCategoriesPage
 * หน้าเพจสำหรับจัดการหมวดหมู่ข่าวสาร (Admin)
 * แก้ไข: ลบ AdminLayout ซ้อนออก เพราะถูกจัดการโดย AdminRouteGuard ใน AppRouter แล้ว
 */
const NewsCategoriesPage = () => {
    return <NewsCategoriesModule />;
};

export default NewsCategoriesPage;
