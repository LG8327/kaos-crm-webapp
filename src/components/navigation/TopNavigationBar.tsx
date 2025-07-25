// src/components/navigation/TopNavigationBar.tsx
import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface TopNavigationBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightActions?: Array<{
    icon: React.ElementType;
    label: string;
    action: () => void;
    color?: string;
  }>;
  onUserMenuToggle: () => void;
  userInfo: {
    name: string;
    email: string;
    role: string;
  };
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightActions = [],
  onUserMenuToggle,
  userInfo
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={onBackPress}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            {rightActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-2 rounded-lg transition-colors ${
                  action.color || 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title={action.label}
              >
                <action.icon className="h-5 w-5" />
              </button>
            ))}

            {/* User Avatar */}
            <button
              onClick={onUserMenuToggle}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
