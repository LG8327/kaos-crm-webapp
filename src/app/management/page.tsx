'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/supabase';
import { ManagementDashboard } from '../../components/management/ManagementDashboard';
import { SharedLayout } from '../../components/layout/SharedLayout';

export default function ManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [selectedTab, setSelectedTab] = useState('management');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 ManagementPage: Checking authentication...');
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('✅ ManagementPage: User authenticated');
        
        // Get user role from localStorage or user metadata
        const role = localStorage.getItem('userRole') || user.user_metadata?.role || 'Sales Rep';
        setUserRole(role);
        
        // Check if user has management access
        if (role === 'manager' || role === 'Manager' || role === 'Admin' || role === 'HR') {
          console.log('✅ ManagementPage: User has management access');
          setIsAuthenticated(true);
        } else {
          console.log('❌ ManagementPage: User does not have management access');
          router.push('/dashboard');
          return;
        }
      } else {
        console.log('❌ ManagementPage: User not authenticated');
        router.push('/');
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    
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
        // Already on management page
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show access denied if not authenticated or authorized
  if (!isAuthenticated) {
    return (
      <SharedLayout selectedTab="management" title="Management Dashboard">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You need manager or higher privileges to access this page.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </SharedLayout>
    );
  }

  // Show management dashboard
  return (
    <SharedLayout selectedTab="management" title="Management Dashboard">
      <ManagementDashboard userRole={userRole} />
    </SharedLayout>
  );
}
