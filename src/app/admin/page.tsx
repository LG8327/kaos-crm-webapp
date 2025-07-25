'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/supabase';
import { AdminDashboardContent } from '../../components/admin/AdminDashboardContent';
import { AppLayout } from '../../components/layout/AppLayout';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [selectedTab, setSelectedTab] = useState('admin');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AdminPage: Checking authentication...');
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('✅ AdminPage: User authenticated');
        
        // Get user role from localStorage or user metadata
        const role = localStorage.getItem('userRole') || user.user_metadata?.role || 'Sales Rep';
        setUserRole(role);
        
        // Check if user has admin access
        if (role === 'Admin' || role === 'HR') {
          setIsAuthenticated(true);
        } else {
          console.log('❌ AdminPage: User does not have admin access, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
        
        setIsLoading(false);
      } else {
        console.log('❌ AdminPage: User not authenticated, redirecting to login');
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
        // Stay on current page
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Access Denied</div>
          <div className="text-gray-400">You don&apos;t have permission to access this page.</div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
    >
      <AdminDashboardContent />
    </AppLayout>
  );
}
