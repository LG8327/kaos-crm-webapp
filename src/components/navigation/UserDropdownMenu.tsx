// src/components/navigation/UserDropdownMenu.tsx
import React, { useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield,
  Bell,
  HelpCircle,
  Moon,
  ChevronRight
} from 'lucide-react';

interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  userInfo: {
    name: string;
    email: string;
    role: string;
  };
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  isOpen,
  onClose,
  onSignOut,
  userInfo
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      action: () => alert('Profile settings coming soon'),
      color: 'text-gray-600'
    },
    {
      icon: Settings,
      label: 'Settings',
      action: () => alert('Settings'),
      color: 'text-gray-600'
    },
    {
      icon: Bell,
      label: 'Notifications',
      action: () => alert('Notifications'),
      color: 'text-gray-600'
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      action: () => alert('Privacy settings'),
      color: 'text-gray-600'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => alert('Help center'),
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="absolute top-16 right-4 w-72 z-50">
      <div
        ref={menuRef}
        className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-700 text-lg font-semibold">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold truncate">{userInfo.name}</h3>
              <p className="text-gray-600 text-sm truncate">{userInfo.email}</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {userInfo.role}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${item.color} group-hover:text-gray-900 transition-colors`} />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600 font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
