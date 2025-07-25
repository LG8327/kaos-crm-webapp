'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/supabase';
import { SettingsView } from '../../components/settings/SettingsView';
import { AppLayout } from '../../components/layout/AppLayout';

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('settings');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 SettingsPage: Checking authentication...');
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('✅ SettingsPage: User authenticated');
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        console.log('❌ SettingsPage: User not authenticated, redirecting to login');
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    
    // Navigate to appropriate pages
    switch (tabId) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'leads':
        router.push('/leads');
        break;
      case 'territories':
        router.push('/territories');
        break;
      case 'management':
        router.push('/management');
        break;
      case 'admin':
        router.push('/admin');
        break;
      case 'settings':
        // Stay on current page
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AppLayout
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
    >
      <SettingsView />
    </AppLayout>
  );
}
