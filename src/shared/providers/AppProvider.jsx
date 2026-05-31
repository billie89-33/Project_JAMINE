import { AuthProvider } from '@/shared/contexts/AuthContext';
import { CartProvider } from '@/shared/contexts/CartContext';

/**
 * 📦 Global App Provider
 * มัดรวม Provider ทั้งหมดของแอปพลิเคชันไว้ที่เดียวเพื่อแก้ปัญหา Context Hell
 */
export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
};
