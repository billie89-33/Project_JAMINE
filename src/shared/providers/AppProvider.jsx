import { AuthProvider } from '@/shared/contexts/AuthContext';
// import { ThemeProvider } from '@/shared/contexts/ThemeContext';

/**
 * 📦 Global App Provider
 * มัดรวม Provider ทั้งหมดของแอปพลิเคชันไว้ที่เดียวเพื่อแก้ปัญหา Context Hell
 */
export const AppProvider = ({ children }) => {
    return (
        /* <ThemeProvider> */
            <AuthProvider>
                {children}
            </AuthProvider>
        /* </ThemeProvider> */
    );
};
