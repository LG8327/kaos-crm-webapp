// src/components/navigation/BottomTabBar.tsx
import React from 'react';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar,
  UserCheck,
  Building2,
  Settings
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  isVisible: boolean;
}

interface BottomTabBarProps {
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  userRole: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  selectedTab,
  onTabChange,
  userRole
}) => {
  const isAdmin = userRole === 'Admin' || userRole === 'HR';
  const isSalesManager = userRole === 'Sales Manager';

  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      isVisible: true
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      badge: 3, // Example badge count
      isVisible: true
    },
    {
      id: 'territories',
      label: 'Territories',
      icon: MapPin,
      isVisible: true
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      isVisible: true
    },
    {
      id: 'management',
      label: 'Management',
      icon: UserCheck,
      isVisible: isSalesManager || isAdmin
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Building2,
      isVisible: isAdmin
    }
  ].filter(tab => tab.isVisible);

  // Limit to 5 tabs max for better mobile experience
  const visibleTabs = tabs.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Tab Bar Background with Blur */}
      <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {visibleTabs.map((tab) => {
              const isSelected = selectedTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative transition-all duration-200 ${
                    isSelected
                      ? 'text-purple-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {/* Icon Container */}
                  <div className="relative mb-1">
                    <Icon className={`h-6 w-6 transition-transform duration-200 ${
                      isSelected ? 'scale-110' : 'scale-100'
                    }`} />
                    
                    {/* Badge */}
                    {tab.badge && tab.badge > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    isSelected ? 'text-purple-400' : 'text-gray-500'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Safe Area for iPhone */}
        <div className="h-safe-area-inset-bottom bg-gray-900/95"></div>
      </div>
    </div>
  );
};
