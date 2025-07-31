// src/components/management/ManagementDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, Target, BarChart3, UserCheck, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ManagementDashboardProps {
  userRole: string;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  territory?: string;
  leadsCount?: number;
  performance?: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ userRole }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'territories' | 'performance'>('overview');

  useEffect(() => {
    loadManagementData();
  }, []);

  const loadManagementData = async () => {
    setIsLoading(true);
    
    try {
      // Load team members (for managers, show their direct reports)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('isActive', true)
        .in('role', ['sales_rep', 'Sales Rep']);

      if (usersError) {
        console.error('Error loading team members:', usersError);
      } else {
        setTeamMembers(users || []);
      }

      // Load performance metrics
      const metrics: PerformanceMetric[] = [
        {
          label: 'Team Members',
          value: users?.length?.toString() || '0',
          change: '+2 this month',
          trend: 'up',
          icon: <Users className="h-5 w-5" />
        },
        {
          label: 'Active Leads',
          value: '147',
          change: '+12% vs last month',
          trend: 'up',
          icon: <Target className="h-5 w-5" />
        },
        {
          label: 'Territories',
          value: '8',
          change: 'No change',
          trend: 'neutral',
          icon: <MapPin className="h-5 w-5" />
        },
        {
          label: 'Team Performance',
          value: '87%',
          change: '+5% improvement',
          trend: 'up',
          icon: <TrendingUp className="h-5 w-5" />
        }
      ];

      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading management data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600">{metric.icon}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'bg-gray-100 text-gray-700' :
                metric.trend === 'down' ? 'bg-gray-100 text-gray-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors">
            <UserCheck className="h-6 w-6 text-gray-600 mb-2" />
            <div className="text-gray-900 font-medium">Review Team Performance</div>
            <div className="text-gray-600 text-sm">Weekly team assessments</div>
          </button>
          
          <button className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors">
            <Calendar className="h-6 w-6 text-gray-600 mb-2" />
            <div className="text-gray-900 font-medium">Schedule Team Meeting</div>
            <div className="text-gray-600 text-sm">Plan strategy sessions</div>
          </button>
          
          <button className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors">
            <AlertCircle className="h-6 w-6 text-gray-600 mb-2" />
            <div className="text-gray-900 font-medium">Territory Assignments</div>
            <div className="text-gray-600 text-sm">Manage territory allocation</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-gray-600" />
          Team Members
        </h3>
        
        <div className="space-y-3">
          {teamMembers.length > 0 ? teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-gray-900 font-medium">{member.firstName} {member.lastName}</div>
                  <div className="text-gray-600 text-sm">{member.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-gray-900 text-sm">{member.role}</div>
                  <div className="text-gray-600 text-xs">
                    Status: {member.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors border border-gray-200">
                    View
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors border border-gray-200">
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-600 py-8">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No team members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTerritoryManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-gray-600" />
          Territory Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((territory) => (
            <div key={territory} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-900 font-medium">Territory {territory}</h4>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="text-gray-900">Sales Rep {territory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Leads:</span>
                  <span className="text-gray-900">{Math.floor(Math.random() * 20) + 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance:</span>
                  <span className="text-gray-700">{Math.floor(Math.random() * 20) + 80}%</span>
                </div>
              </div>
              
              <button className="w-full mt-3 bg-blue-100 text-blue-700 py-2 rounded text-xs hover:bg-blue-200 transition-colors border border-blue-200">
                Manage Territory
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
          Performance Analytics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-gray-900 font-medium mb-4">Team Performance Trends</h4>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p>Performance Chart</p>
                <p className="text-xs">Integration with analytics library needed</p>
              </div>
            </div>
          </div>
          
          {/* Territory Performance */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-gray-900 font-medium mb-4">Territory Performance</h4>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((territory) => (
                <div key={territory} className="flex items-center justify-between">
                  <span className="text-gray-700">Territory {territory}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-900 text-sm w-10">{Math.floor(Math.random() * 40) + 60}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-xl h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
        <p className="text-gray-600">Team oversight and performance management</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit border border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'team', label: 'Team' },
            { id: 'territories', label: 'Territories' },
            { id: 'performance', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'team' && renderTeamManagement()}
      {activeTab === 'territories' && renderTerritoryManagement()}
      {activeTab === 'performance' && renderPerformanceAnalytics()}
    </div>
  );
};
