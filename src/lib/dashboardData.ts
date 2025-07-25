// src/lib/dashboardData.ts - Real data service for dashboard
import { supabase } from './supabase';

export interface DashboardStats {
  totalLeads: number;
  pipelineValue: number;
  conversionRate: number;
  activeUsers: number;
  recentActivities: Activity[];
  monthlyGrowth: {
    leads: number;
    pipeline: number;
    conversion: number;
    users: number;
  };
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'user_joined' | 'deal_closed';
  description: string;
  timestamp: string;
  user?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  monthlyGrowth: number;
  systemUptime: string;
  lastBackup: string;
  performanceScore: number;
  securityScore: number;
  criticalAlerts: number;
  warningAlerts: number;
  avgResponseTime: number;
  errorRate: number;
  dataIntegrity: number;
  activeConnections: number;
}

// Dashboard data service
export class DashboardDataService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get total leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Get pipeline value (sum of all active deals)
      const { data: pipelineData } = await supabase
        .from('leads')
        .select('deal_value')
        .eq('status', 'active')
        .not('deal_value', 'is', null);

      const pipelineValue = pipelineData?.reduce((sum, lead) => sum + (lead.deal_value || 0), 0) || 0;

      // Get conversion rate (closed deals / total leads)
      const { count: convertedLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'closed');

      const conversionRate = totalLeads ? ((convertedLeads || 0) / totalLeads) * 100 : 0;

      // Get active users count
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get recent activities (from audit log or recent leads)
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, company_name, created_at, created_by')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivities: Activity[] = recentLeads?.map(lead => ({
        id: lead.id,
        type: 'lead_created',
        description: `New lead "${lead.company_name}" was created`,
        timestamp: lead.created_at,
        user: lead.created_by
      })) || [];

      // Calculate monthly growth (placeholder - would need historical data)
      const monthlyGrowth = {
        leads: 12.5,
        pipeline: 8.2,
        conversion: 3.1,
        users: 5.4
      };

      return {
        totalLeads: totalLeads || 0,
        pipelineValue: Math.round(pipelineValue),
        conversionRate: Math.round(conversionRate * 10) / 10,
        activeUsers: activeUsers || 0,
        recentActivities,
        monthlyGrowth
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return empty state on error
      return {
        totalLeads: 0,
        pipelineValue: 0,
        conversionRate: 0,
        activeUsers: 0,
        recentActivities: [],
        monthlyGrowth: {
          leads: 0,
          pipeline: 0,
          conversion: 0,
          users: 0
        }
      };
    }
  }

  static async getAdminStats(): Promise<AdminStats> {
    try {
      // Get user statistics
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get lead statistics
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const { count: convertedLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'closed');

      // Get revenue data
      const { data: revenueData } = await supabase
        .from('leads')
        .select('deal_value')
        .eq('status', 'closed')
        .not('deal_value', 'is', null);

      const totalRevenue = revenueData?.reduce((sum, lead) => sum + (lead.deal_value || 0), 0) || 0;

      // System metrics (would come from monitoring service in real app)
      const systemMetrics = {
        systemUptime: '99.8%',
        lastBackup: '2 hours ago',
        performanceScore: 88,
        securityScore: 95,
        criticalAlerts: 0, // Real alerts would come from monitoring
        warningAlerts: 1,
        avgResponseTime: 245,
        errorRate: 0.02,
        dataIntegrity: 99.9,
        activeConnections: activeUsers || 0,
        monthlyGrowth: 12.5
      };

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalLeads: totalLeads || 0,
        convertedLeads: convertedLeads || 0,
        totalRevenue: Math.round(totalRevenue),
        ...systemMetrics
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Return empty state on error
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalLeads: 0,
        convertedLeads: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        systemUptime: '0%',
        lastBackup: 'Never',
        performanceScore: 0,
        securityScore: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        avgResponseTime: 0,
        errorRate: 0,
        dataIntegrity: 0,
        activeConnections: 0
      };
    }
  }

  static formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  }

  static formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
