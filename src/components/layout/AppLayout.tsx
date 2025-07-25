// src/components/layout/AppLayout.tsx - Updated for top navigation
import React, { useState } from 'react';
import { SegmentedNavigationBar } from '../navigation/SegmentedNavigationBar';
import { TopStatusBar } from '../navigation/TopStatusBar';
import { UserDropdownMenu } from '../navigation/UserDropdownMenu';
import { Bell, Search, Plus, MoreHorizontal } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  userRole?: string;
  rightActions?: Array<{
    icon: React.ElementType;
    label: string;
    action: () => void;
    color?: string;
  }>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedTab,
  onTabChange,
  userRole: propUserRole,
  rightActions = []
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get user info from localStorage, with prop override if provided
  const userInfo = {
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || 'user@example.com',
    role: propUserRole || localStorage.getItem('userRole') || 'Sales Rep'
  };

  const handleSignOut = async () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* iOS-style Status Bar */}
      <TopStatusBar />
      
      {/* Segmented Navigation */}
      <SegmentedNavigationBar
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        userRole={userInfo.role}
      />

      {/* Secondary Actions Bar (if needed) */}
      {(rightActions.length > 0 || true) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50">
          <div className="flex items-center space-x-4">
            {/* Page-specific left actions can go here */}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Custom Action Buttons */}
            {rightActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-2 rounded-full transition-colors hover:bg-gray-800 ${
                  action.color || 'text-gray-400 hover:text-white'
                }`}
                title={action.label}
              >
                <action.icon className="h-5 w-5" />
              </button>
            ))}

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* User Dropdown Menu */}
      <UserDropdownMenu
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onSignOut={handleSignOut}
        userInfo={userInfo}
      />

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
};
