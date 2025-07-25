// src/components/navigation/SegmentedNavigationBar.tsx
import React from 'react';

interface NavigationTab {
  id: string;
  label: string;
  isVisible: boolean;
}

interface SegmentedNavigationBarProps {
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  userRole: string;
}

export const SegmentedNavigationBar: React.FC<SegmentedNavigationBarProps> = ({
  selectedTab,
  onTabChange,
  userRole
}) => {
  const isAdmin = userRole === 'Admin' || userRole === 'HR';
  const isSalesManager = userRole === 'Sales Manager';
  const isManager = userRole === 'manager' || userRole === 'Manager' || isAdmin;

  const tabs: NavigationTab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      isVisible: true
    },
    {
      id: 'leads',
      label: 'Leads',
      isVisible: true
    },
    {
      id: 'territories',
      label: 'Territories',
      isVisible: true
    },
    {
      id: 'management',
      label: 'Management',
      isVisible: isManager
    },
    {
      id: 'admin',
      label: 'Admin',
      isVisible: isAdmin
    },
    {
      id: 'settings',
      label: 'Settings',
      isVisible: true
    }
  ].filter(tab => tab.isVisible);

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex justify-center">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-full p-1 shadow-lg border border-gray-700/50">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => {
              const isSelected = selectedTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                    isSelected
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  
                  {/* Animated background for selected state */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
