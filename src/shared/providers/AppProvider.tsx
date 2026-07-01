import React, { ReactNode } from 'react';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { CartProvider } from '@/shared/contexts/CartContext';

interface AppProviderProps {
    children: ReactNode;
}

/**
 * 📦 Global App Provider
 * มัดรวม Provider ทั้งหมดของแอปพลิเคชันไว้ที่เดียวเพื่อแก้ปัญหา Context Hell
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
};
