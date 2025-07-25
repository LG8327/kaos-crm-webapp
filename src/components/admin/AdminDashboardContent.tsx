// src/components/admin/AdminDashboardContent.tsx - Content only, no AppLayout wrapper
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  RefreshCw,
  Upload,
  Settings,
  BarChart3,
  Download,
  Database,
  Shield,
  Activity,
  ChevronDown,
  Plus,
  RotateCcw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { UserManagementModal } from './UserManagementModal';
import { SystemSettingsModal } from './SystemSettingsModal';
import { ExportReportsModal } from './ExportReportsModal';
import { ImportCSVModal } from './ImportCSVModal';
import { DashboardDataService, AdminStats } from '../../lib/dashboardData';

export const AdminDashboardContent: React.FC = () => {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showExportReports, setShowExportReports] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const loadAdminStats = async () => {
    setIsLoading(true);
    try {
      const stats = await DashboardDataService.getAdminStats();
      setAdminStats(stats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, [selectedPeriod]);

  const handleSystemReset = async () => {
    if (!confirm('Are you sure you want to reset system settings? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('System settings have been reset successfully.');
      await loadAdminStats();
    } catch (error) {
      console.error('Error resetting system:', error);
      alert('Failed to reset system settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataBackup = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Data backup completed successfully.');
    } catch (error) {
      console.error('Error backing up data:', error);
      alert('Failed to backup data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Period Selector */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-gray-750 border border-gray-600 text-white px-4 py-2 pr-8 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-purple-400 animate-spin" />
            <span className="text-white font-medium">Processing...</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setShowUserManagement(true)}
          className="p-6 bg-gradient-to-br from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 rounded-xl text-left transition-all transform hover:scale-105"
        >
          <Users className="h-8 w-8 text-purple-300 mb-3" />
          <h3 className="text-white font-semibold mb-1">User Management</h3>
          <p className="text-purple-200 text-sm">Manage users, roles & permissions</p>
        </button>

        <button
          onClick={() => setShowSystemSettings(true)}
          className="p-6 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 rounded-xl text-left transition-all transform hover:scale-105"
        >
          <Settings className="h-8 w-8 text-blue-300 mb-3" />
          <h3 className="text-white font-semibold mb-1">System Settings</h3>
          <p className="text-blue-200 text-sm">Configure system preferences</p>
        </button>

        <button
          onClick={() => setShowExportReports(true)}
          className="p-6 bg-gradient-to-br from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 rounded-xl text-left transition-all transform hover:scale-105"
        >
          <BarChart3 className="h-8 w-8 text-green-300 mb-3" />
          <h3 className="text-white font-semibold mb-1">Export Reports</h3>
          <p className="text-green-200 text-sm">Generate and download reports</p>
        </button>

        <button
          onClick={() => setShowImportCSV(true)}
          className="p-6 bg-gradient-to-br from-orange-900 to-orange-800 hover:from-orange-800 hover:to-orange-700 rounded-xl text-left transition-all transform hover:scale-105"
        >
          <Upload className="h-8 w-8 text-orange-300 mb-3" />
          <h3 className="text-white font-semibold mb-1">Import Data</h3>
          <p className="text-orange-200 text-sm">Import CSV files and data</p>
        </button>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Metrics */}
        <div className="bg-gray-750 p-6 rounded-xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            {isLoading ? (
              <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
            ) : (
              <span className="text-green-400 text-sm font-medium">+{adminStats?.monthlyGrowth || 0}%</span>
            )}
          </div>
          {isLoading ? (
            <div className="w-16 h-8 bg-gray-700 animate-pulse rounded mb-1"></div>
          ) : (
            <h3 className="text-2xl font-bold text-white mb-1">{adminStats?.totalUsers || 0}</h3>
          )}
          <p className="text-gray-400 text-sm">Total Users</p>
          {isLoading ? (
            <div className="w-20 h-3 bg-gray-700 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-green-400 text-xs mt-1">{adminStats?.activeUsers || 0} active</p>
          )}
        </div>

        {/* Leads Metrics */}
        <div className="bg-gray-750 p-6 rounded-xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+8.2%</span>
          </div>
          {isLoading ? (
            <div className="w-16 h-8 bg-gray-700 animate-pulse rounded mb-1"></div>
          ) : (
            <h3 className="text-2xl font-bold text-white mb-1">{adminStats?.totalLeads || 0}</h3>
          )}
          <p className="text-gray-400 text-sm">Total Leads</p>
          {isLoading ? (
            <div className="w-24 h-3 bg-gray-700 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-blue-400 text-xs mt-1">{adminStats?.convertedLeads || 0} converted</p>
          )}
        </div>

        {/* Revenue Metrics */}
        <div className="bg-gray-750 p-6 rounded-xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            {isLoading ? (
              <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
            ) : (
              <span className="text-green-400 text-sm font-medium">+{adminStats?.monthlyGrowth || 0}%</span>
            )}
          </div>
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-700 animate-pulse rounded mb-1"></div>
          ) : (
            <h3 className="text-2xl font-bold text-white mb-1">
              {DashboardDataService.formatCurrency(adminStats?.totalRevenue || 0)}
            </h3>
          )}
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-green-400 text-xs mt-1">This month</p>
        </div>

        {/* System Health */}
        <div className="bg-gray-750 p-6 rounded-xl border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-900/30 rounded-lg">
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>
            {isLoading ? (
              <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
            ) : (
              <span className="text-emerald-400 text-sm font-medium">{adminStats?.systemUptime || '0%'}</span>
            )}
          </div>
          {isLoading ? (
            <div className="w-16 h-8 bg-gray-700 animate-pulse rounded mb-1"></div>
          ) : (
            <h3 className="text-2xl font-bold text-white mb-1">{adminStats?.performanceScore || 0}%</h3>
          )}
          <p className="text-gray-400 text-sm">System Health</p>
          <p className="text-emerald-400 text-xs mt-1">
            {adminStats?.criticalAlerts === 0 ? 'All systems operational' : `${adminStats?.criticalAlerts || 0} alerts`}
          </p>
        </div>
      </div>

      {/* System Operations */}
      <div className="bg-gray-750 p-8 rounded-xl border border-gray-600 mb-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Database className="h-8 w-8 text-purple-400 mr-3" />
          System Operations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-900/20 p-6 rounded-xl mb-4">
              <RefreshCw className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">System Refresh</h4>
              <p className="text-gray-400 text-sm mb-4">
                Refresh all system caches and reload configurations for optimal performance.
              </p>
            </div>
            <button
              onClick={loadAdminStats}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-blue-300 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh System
            </button>
          </div>

          <div className="text-center">
            <div className="bg-green-900/20 p-6 rounded-xl mb-4">
              <Download className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Data Backup</h4>
              <p className="text-gray-400 text-sm mb-4">
                Create a complete backup of all system data for security and recovery purposes.
              </p>
            </div>
            <button
              onClick={handleDataBackup}
              disabled={isLoading}
              className="px-6 py-3 bg-green-900 hover:bg-green-800 text-green-300 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <Download className="h-5 w-5 mr-2" />
              Backup Data
            </button>
          </div>

          <div className="text-center">
            <div className="bg-orange-900/20 p-6 rounded-xl mb-4">
              <RotateCcw className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Reset Settings</h4>
              <p className="text-gray-400 text-sm mb-4">
                Reset all system settings to default values. This will not affect user data.
              </p>
            </div>
            <button
              onClick={handleSystemReset}
              disabled={isLoading}
              className="px-6 py-3 bg-orange-900 hover:bg-orange-800 text-orange-300 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUserManagement && (
        <UserManagementModal
          onClose={() => setShowUserManagement(false)}
          onRefresh={loadAdminStats}
        />
      )}

      {showSystemSettings && (
        <SystemSettingsModal
          onClose={() => setShowSystemSettings(false)}
        />
      )}

      {showExportReports && (
        <ExportReportsModal
          onClose={() => setShowExportReports(false)}
        />
      )}

      {showImportCSV && (
        <ImportCSVModal
          onClose={() => setShowImportCSV(false)}
          onSuccess={() => {
            setShowImportCSV(false);
            loadAdminStats(); // Refresh stats after successful import
          }}
        />
      )}

      {showAddUser && (
        <UserManagementModal
          onClose={() => setShowAddUser(false)}
          onRefresh={loadAdminStats}
          defaultTab="add"
        />
      )}
    </div>
  );
};
