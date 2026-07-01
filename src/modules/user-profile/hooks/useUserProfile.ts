import { useSearchParams } from 'react-router-dom';

/**
 * 🎣 useUserProfile Hook
 * จัดการสถานะการสลับ Tab และ Logic อื่นๆ ของหน้า Profile
 */
export const useUserProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Sync activeTab with URL param
  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  return {
    activeTab,
    handleTabChange
  };
};
