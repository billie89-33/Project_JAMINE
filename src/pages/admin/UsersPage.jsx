import React from 'react';
import { UsersModule } from '@/modules/admin';

/**
 * 👨‍👩‍👧‍👦 UsersPage
 * หน้าเพจสำหรับจัดการลูกค้า (Admin)
 * แก้ไข: ลบ AdminLayout ซ้อนออก เพราะถูกจัดการโดย AdminRouteGuard ใน AppRouter แล้ว
 */
const UsersPage = () => {
    return <UsersModule />;
};

export default UsersPage;
