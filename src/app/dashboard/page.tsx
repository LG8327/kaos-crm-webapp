'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/supabase';
import { SharedLayout } from '../../components/layout/SharedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Building2, 
  Target, 
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  Clock,
  Search,
  Bell,
  Settings,
  Home,
  UserCircle,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  ChevronDown,
  Plus,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  TrendingDown
} from "lucide-react"

import data from "./data.json"

// Enhanced Metric Card

// Modern Top Bar
const ModernTopBar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gray-400 rounded-full"></span>
        </button>
        
        {/* Profile */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  )
}

// Enhanced Metric Card
const EnhancedMetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend,
  trendDirection = "up",
  icon: Icon,
  color = "gray"
}: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: any;
  color?: "gray";
}) => {
  const colorClasses = {
    gray: "bg-white"
  }

  const iconColors = {
    gray: "text-gray-600"
  }

  const trendColors = {
    up: "text-gray-600",
    down: "text-gray-600",
    neutral: "text-gray-600"
  }

  return (
    <Card className={`${colorClasses[color]} border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && (
              <div className="flex items-center mt-2">
                {trendDirection === "up" && <TrendingUp className="h-4 w-4 text-gray-600 mr-1" />}
                {trendDirection === "down" && <TrendingDown className="h-4 w-4 text-gray-600 mr-1" />}
                <span className={`text-sm font-medium ${trendColors[trendDirection]}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gray-100 shadow-sm ${iconColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Actions Panel
const QuickActionsPanel = () => {
  const actions = [
    { icon: Plus, label: "Add Lead", color: "bg-gray-100" },
    { icon: Users, label: "New Territory", color: "bg-gray-200" },
    { icon: FileText, label: "Generate Report", color: "bg-gray-300" },
    { icon: Download, label: "Export Data", color: "bg-gray-400" }
  ]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${action.color} text-gray-700`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Activity Feed
const EnhancedActivityFeed = () => {
  const activities = [
    { 
      type: "deal", 
      message: "Sarah J. closed $45K deal with TechCorp", 
      time: "2 hours ago", 
      avatar: "SJ",
      color: "bg-gray-100" 
    },
    { 
      type: "meeting", 
      message: "Team meeting scheduled for tomorrow at 10 AM", 
      time: "4 hours ago", 
      avatar: "MT",
      color: "bg-gray-200" 
    },
    { 
      type: "alert", 
      message: "Territory 'Downtown' needs immediate attention", 
      time: "6 hours ago", 
      avatar: "AL",
      color: "bg-gray-300" 
    },
    { 
      type: "user", 
      message: "New team member Mike Chen joined the sales team", 
      time: "1 day ago", 
      avatar: "MC",
      color: "bg-gray-400" 
    }
  ]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
          View All
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-gray-700 text-xs font-medium`}>
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Performance Chart Placeholder
const PerformanceChart = () => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Revenue Performance</CardTitle>
        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart will be integrated here</p>
            <p className="text-xs text-gray-400">Revenue trends and performance metrics</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 DashboardPage: Checking authentication...');
      
      const user = await getCurrentUser();
      
      if (user) {
        console.log('✅ DashboardPage: User authenticated');
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        console.log('❌ DashboardPage: User not authenticated, redirecting to login');
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated (this should not happen due to useEffect redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Calculate metrics from data (will be replaced with real Supabase queries)
  const totalLeads = data.filter(item => item.type === 'lead').length
  const activeLeads = data.filter(item => item.type === 'lead' && item.status !== 'new').length
  const wonLeads = data.filter(item => item.type === 'lead' && item.status === 'proposal').length
  const totalTerritories = data.filter(item => item.type === 'territory').length
  const activeTerritories = data.filter(item => item.type === 'territory' && item.status === 'active').length
  const totalAccounts = data.filter(item => item.type === 'account').length

  const monthlySales = 245600
  const salesGrowth = "+12%"
  const pipelineValue = 2400000 // $2.4M
  const quotaAttainment = 85

  return (
    <SharedLayout selectedTab={selectedTab}>
      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedMetricCard
            title="Total Revenue"
            value={`$${(pipelineValue/1000000).toFixed(1)}M`}
            subtitle="Monthly pipeline value"
            trend="+12% from last month"
            trendDirection="up"
            icon={DollarSign}
            color="gray"
          />
          <EnhancedMetricCard
            title="Active Leads"
            value={totalLeads.toString()}
            subtitle={`${activeLeads} qualified leads`}
            trend="+8% from last week"
            trendDirection="up"
            icon={Users}
            color="gray"
          />
          <EnhancedMetricCard
            title="Territory Coverage"
            value={`${Math.round((activeTerritories/totalTerritories) * 100)}%`}
            subtitle={`${activeTerritories} of ${totalTerritories} territories`}
            trend="-2% needs attention"
            trendDirection="down"
            icon={MapPin}
            color="gray"
          />
          <EnhancedMetricCard
            title="Quota Attainment"
            value={`${quotaAttainment}%`}
            subtitle="Team performance"
            trend="On track"
            trendDirection="neutral"
            icon={Target}
            color="gray"
          />
        </div>

          {/* Secondary Metrics Row */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{totalAccounts}</div>
                  <div className="text-sm text-gray-600">Enterprise Accounts</div>
                  <div className="text-xs text-gray-600 mt-1">+5 this month</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">23</div>
                  <div className="text-sm text-gray-600">Active Sales Reps</div>
                  <div className="text-xs text-gray-600 mt-1">4.2/5 avg rating</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">$180K</div>
                  <div className="text-sm text-gray-600">This Month Revenue</div>
                  <div className="text-xs text-gray-600 mt-1">+12% growth</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart />
              
              {/* Team Performance Overview */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Johnson", progress: 92, target: "$85K", current: "$78K" },
                      { name: "Mike Chen", progress: 78, target: "$75K", current: "$58K" },
                      { name: "Alex Rivera", progress: 88, target: "$90K", current: "$79K" },
                      { name: "Emma Davis", progress: 95, target: "$80K", current: "$76K" }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-900">{member.name}</span>
                            <span className="text-sm text-gray-600">{member.current} / {member.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                member.progress >= 90 ? 'bg-gray-400' : 
                                member.progress >= 75 ? 'bg-gray-300' : 'bg-gray-300'
                              }`}
                              style={{ width: `${member.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{member.progress}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity & Actions */}
            <div className="space-y-6">
              <QuickActionsPanel />
              <EnhancedActivityFeed />
              
              {/* System Status */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Response</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">234ms avg</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Storage</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">78% capacity</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">1,247 users</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Promotional Banner */}
          <Card className="border border-gray-200 shadow-sm bg-gray-100 text-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-200 rounded-lg">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Q1 Fiber & Wireless Promotion</h3>
                    <p className="text-gray-600">20% off all fiber packages + Free wireless upgrade</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">20% OFF</div>
                  <div className="text-sm text-gray-600">Valid until March 31, 2025</div>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </SharedLayout>
  )
}
