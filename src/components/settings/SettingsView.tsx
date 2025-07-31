// src/components/settings/SettingsView.tsx
import React from 'react';
import { User, Bell, Shield, Palette, Database, HelpCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', action: () => alert('Profile settings') },
        { icon: Bell, label: 'Notifications', action: () => alert('Notifications') },
        { icon: Shield, label: 'Privacy & Security', action: () => alert('Privacy') }
      ]
    },
    {
      title: 'App',
      items: [
        { icon: Palette, label: 'Appearance', action: () => alert('Appearance') },
        { icon: Database, label: 'Data & Storage', action: () => alert('Data') }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => alert('Help') }
      ]
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-2xl">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {group.items.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                >
                  <item.icon className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-900 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
