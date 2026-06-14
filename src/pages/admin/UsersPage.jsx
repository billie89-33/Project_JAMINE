import React from 'react';
import AdminLayout from '@/layouts/AdminLayout/AdminLayout';
import { UsersModule } from '@/modules/admin';

/**
 * 👨‍👩‍👧‍👦 UsersPage
 * หน้าเพจสำหรับจัดการลูกค้า (Admin)
 */
const UsersPage = () => {
    return (
        <AdminLayout>
            <UsersModule />
        </AdminLayout>
    );
};

export default UsersPage;
