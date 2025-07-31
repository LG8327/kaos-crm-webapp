// src/components/navigation/TopStatusBar.tsx
import React from 'react';

export const TopStatusBar: React.FC = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 text-gray-900 text-sm font-medium bg-white border-b border-gray-200">
      {/* Left side - Time and Date */}
      <div className="flex items-center space-x-2">
        <span>{getCurrentTime()}</span>
        <span className="text-gray-600">{getCurrentDate()}</span>
      </div>

      {/* Right side - Empty for cleaner look */}
      <div className="flex items-center">
        {/* Status indicators removed */}
      </div>
    </div>
  );
};
