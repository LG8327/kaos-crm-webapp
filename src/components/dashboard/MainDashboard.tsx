// src/components/dashboard/MainDashboard.tsx - Updated to use segmented navigation
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '../layout/AppLayout';
import { Plus, Search, Filter, Download, Users, Flame, MapPin, DollarSign } from 'lucide-react';
import { AdminDashboardContent } from '../admin/AdminDashboardContent';
import { DashboardDataService, DashboardStats } from '../../lib/dashboardData';
import { StatsCard } from './StatsCard';
import { DashboardChart } from './DashboardChart';

// Placeholder components - these will be created later
const LeadsManagement = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-6">
    <div className="text-center py-12">
      <div className="h-16 w-16 bg-teal-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Plus className="h-8 w-8 text-teal-500" />
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
        return []; // Removed plus button and search option from main dashboard
      case 'leads':
        return [
          {
            icon: Plus,
            label: 'Add Lead',
            action: () => alert('Add new lead'),
            color: 'text-teal-400 hover:text-purple-300'
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
            color: 'text-teal-400 hover:text-purple-300'
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
          <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
                Welcome back, {userInfo?.name?.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your territory today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Leads"
                value={isLoading ? "..." : dashboardStats?.totalLeads || 2}
                icon={Users}
                iconColor="text-[var(--uber-green)]"
                change={12}
                changeType="increase"
              />
              
              <StatsCard
                title="Hot Leads"
                value={isLoading ? "..." : "1"}
                icon={Flame}
                iconColor="text-red-500"
                change={8}
                changeType="increase"
              />
              
              <StatsCard
                title="Territories"
                value={isLoading ? "..." : "0"}
                icon={MapPin}
                iconColor="text-blue-500"
                change={0}
                changeType="increase"
              />
              
              <StatsCard
                title="Total Value"
                value={isLoading ? "..." : "$0"}
                icon={DollarSign}
                iconColor="text-[var(--uber-green)]"
                change={15}
                changeType="increase"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardChart title="Sales Performance" type="bar" />
              <DashboardChart title="Revenue Trend" type="area" />
            </div>

            {/* Promotions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">Active Promotions</h2>
                <div className="w-8 h-8 bg-[var(--uber-green)] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Fiber Internet</h3>
                      <p className="text-sm text-muted-foreground">1 Active Campaign</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📶</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-3 h-3 bg-[var(--uber-green)] rounded-full"></div>
                  </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">Wireless</h3>
                      <p className="text-sm text-muted-foreground">1 Active Campaign</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📡</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-3 h-3 bg-[var(--uber-green)] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="w-64 h-4 bg-muted rounded-lg mb-2"></div>
                        <div className="w-24 h-3 bg-muted rounded-lg"></div>
                      </div>
                    </div>
                  ))
                ) : dashboardStats?.recentActivities && dashboardStats.recentActivities.length > 0 ? (
                  dashboardStats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-3 h-3 bg-[var(--uber-green)] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {DashboardDataService.formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                    <p className="text-xs text-muted-foreground mt-2">Activity will appear here as you work with leads</p>
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
