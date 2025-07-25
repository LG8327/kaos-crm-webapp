// src/components/dashboard/MainDashboard.tsx - Updated to use segmented navigation
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '../layout/AppLayout';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { AdminDashboardContent } from '../admin/AdminDashboardContent';
import { DashboardDataService, DashboardStats } from '../../lib/dashboardData';

// Placeholder components - these will be created later
const LeadsManagement = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="text-center py-12">
      <div className="h-16 w-16 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Plus className="h-8 w-8 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Leads Management</h3>
      <p className="text-gray-400">Leads management coming soon</p>
    </div>
  </div>
);

const TerritoryManagement = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="text-center py-12">
      <div className="h-16 w-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Territory Management</h3>
      <p className="text-gray-400">Territory management coming soon</p>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="text-center py-12">
      <div className="h-16 w-16 bg-gray-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Filter className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
      <p className="text-gray-400">Settings panel coming soon</p>
    </div>
  </div>
);

export const MainDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    role: localStorage.getItem('userRole') || 'Sales Rep'
  });

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    
    // Navigate to appropriate pages
    switch (tabId) {
      case 'dashboard':
        // Stay on current page
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
        router.push('/settings');
        break;
      default:
        break;
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (selectedTab === 'dashboard') {
        setIsLoading(true);
        try {
          const stats = await DashboardDataService.getDashboardStats();
          setDashboardStats(stats);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [selectedTab]);

  const getRightActions = () => {
    switch (selectedTab) {
      case 'dashboard':
        return [
          {
            icon: Plus,
            label: 'Add New',
            action: () => alert('Add new item'),
            color: 'text-purple-400 hover:text-purple-300'
          },
          {
            icon: Search,
            label: 'Search',
            action: () => alert('Search'),
            color: 'text-gray-400 hover:text-white'
          }
        ];
      case 'leads':
        return [
          {
            icon: Plus,
            label: 'Add Lead',
            action: () => alert('Add new lead'),
            color: 'text-purple-400 hover:text-purple-300'
          },
          {
            icon: Filter,
            label: 'Filter',
            action: () => alert('Filter leads'),
            color: 'text-gray-400 hover:text-white'
          }
        ];
      case 'admin':
        return [
          {
            icon: Download,
            label: 'Export',
            action: () => alert('Export data'),
            color: 'text-green-400 hover:text-green-300'
          },
          {
            icon: Plus,
            label: 'Add User',
            action: () => alert('Add user'),
            color: 'text-purple-400 hover:text-purple-300'
          }
        ];
      default:
        return [];
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userInfo?.name?.split(' ')[0]}!
              </h2>
              <p className="text-gray-400">
                Here&apos;s what&apos;s happening with your territory today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Leads */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Leads</p>
                    {isLoading ? (
                      <div className="w-16 h-8 bg-gray-700 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-white">{dashboardStats?.totalLeads || 0}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <Plus className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-green-400 text-sm font-medium">
                      ↗ +{dashboardStats?.monthlyGrowth.leads || 0}%
                    </span>
                  )}
                </div>
              </div>

              {/* Pipeline Value */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pipeline Value</p>
                    {isLoading ? (
                      <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {DashboardDataService.formatCurrency(dashboardStats?.pipelineValue || 0)}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                    <Search className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-green-400 text-sm font-medium">
                      ↗ +{dashboardStats?.monthlyGrowth.pipeline || 0}%
                    </span>
                  )}
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Conversion Rate</p>
                    {isLoading ? (
                      <div className="w-16 h-8 bg-gray-700 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-white">{dashboardStats?.conversionRate || 0}%</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <Filter className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-green-400 text-sm font-medium">
                      ↗ +{dashboardStats?.monthlyGrowth.conversion || 0}%
                    </span>
                  )}
                </div>
              </div>

              {/* Active Users */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Users</p>
                    {isLoading ? (
                      <div className="w-12 h-8 bg-gray-700 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-white">{dashboardStats?.activeUsers || 0}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <Download className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <span className="text-green-400 text-sm font-medium">
                      ↗ +{dashboardStats?.monthlyGrowth.users || 0}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeleton
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-48 h-4 bg-gray-700 animate-pulse rounded mb-1"></div>
                        <div className="w-20 h-3 bg-gray-700 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))
                ) : dashboardStats?.recentActivities && dashboardStats.recentActivities.length > 0 ? (
                  // Real activity data
                  dashboardStats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs">
                          {DashboardDataService.formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">No recent activity</p>
                    <p className="text-gray-500 text-xs mt-1">Activity will appear here as you work with leads</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'leads':
        return <LeadsManagement />;
      
      case 'territories':
        return <TerritoryManagement />;
      
      case 'admin':
        return <AdminDashboardContent />;
      
      case 'settings':
        return <SettingsView />;
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <AppLayout
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
      rightActions={getRightActions()}
    >
      {renderContent()}
    </AppLayout>
  );
};
