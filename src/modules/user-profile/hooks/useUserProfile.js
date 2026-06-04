import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 🎣 useUserProfile Hook
 * จัดการสถานะการสลับ Tab และ Logic อื่นๆ ของหน้า Profile
 */
export const useUserProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Sync activeTab with URL param
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return {
    activeTab,
    handleTabChange
  };
};
