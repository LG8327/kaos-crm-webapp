'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/supabase';
import { TerritoriesManagement } from '../../components/territories/TerritoriesManagement';
import { SharedLayout } from '../../components/layout/SharedLayout';

export default function TerritoriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('territories');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 TerritoriesPage: Checking authentication...');
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('✅ TerritoriesPage: User authenticated');
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        console.log('❌ TerritoriesPage: User not authenticated, redirecting to login');
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
        // Stay on current page
        break;
      case 'management':
        router.push('/management');
        break;
      case 'admin':
        router.push('/admin');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <SharedLayout selectedTab="territories" title="Territory Management">
      <TerritoriesManagement />
    </SharedLayout>
  );
}
