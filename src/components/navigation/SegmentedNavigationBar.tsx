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
    <div className="px-6 pt-6 pb-3 bg-white">
      <div className="flex justify-center">
        <div className="bg-gray-100 border border-gray-200 rounded-3xl shadow-sm p-1.5">
          <div className="flex items-center space-x-2">
            {tabs.map((tab) => {
              const isSelected = selectedTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative z-10 px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-2xl ${
                    isSelected
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-200"></div>
                  )}
                  <span className="relative z-10 font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
