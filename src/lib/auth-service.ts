// src/lib/auth-service.ts - Role-based Authentication and Authorization
import { supabase } from './supabase';

export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'hr';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  territories?: string[]; // For sales_rep role - assigned territory IDs
  managedTerritories?: string[]; // For manager role - territories they manage
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  admin: {
    pages: ['dashboard', 'leads', 'territories', 'management', 'admin', 'settings'],
    canViewAllTerritories: true,
    canViewAllLeads: true,
    canManageUsers: true,
    canManageRoles: true,
    canAccessAdmin: true
  },
  manager: {
    pages: ['dashboard', 'leads', 'territories', 'management', 'settings'],
    canViewAllTerritories: true, // Managers can see all territories
    canViewAllLeads: true, // Managers can see all leads
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdmin: false
  },
  sales_rep: {
    pages: ['dashboard', 'leads', 'territories', 'settings'],
    canViewAllTerritories: false, // Only assigned territories
    canViewAllLeads: false, // Only leads in assigned territories
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdmin: false
  },
  hr: {
    pages: ['dashboard', 'leads', 'territories', 'admin', 'settings'],
    canViewAllTerritories: true,
    canViewAllLeads: true,
    canManageUsers: true,
    canManageRoles: true,
    canAccessAdmin: true
  }
};

class AuthService {
  private currentSession: AuthSession | null = null;

  // Authentication Methods
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    try {
      console.log('🔐 AuthService: Starting authentication for:', email);

      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        console.error('❌ AuthService: Authentication failed:', authError.message);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'No user data returned' };
      }

      // Fetch user profile from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          is_active,
          territories:territories(id, name),
          managed_territories:territories!manager_id(id, name)
        `)
        .eq('email', email.trim())
        .single();

      if (userError || !userData) {
        console.error('❌ AuthService: User profile fetch failed:', userError);
        return { success: false, error: 'User profile not found' };
      }

      if (!userData.is_active) {
        return { success: false, error: 'Account is deactivated' };
      }

      // Create AuthUser object
      const user: AuthUser = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role as UserRole,
        isActive: userData.is_active,
        territories: userData.territories?.map((t: any) => t.id) || [],
        managedTerritories: userData.managed_territories?.map((t: any) => t.id) || []
      };

      // Create session
      const session: AuthSession = {
        user,
        accessToken: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token || ''
      };

      // Store session
      this.currentSession = session;
      this.persistSession(session);

      console.log('✅ AuthService: Authentication successful for:', user.email, 'Role:', user.role);
      return { success: true, session };

    } catch (error) {
      console.error('❌ AuthService: Unexpected error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  async signOut(): Promise<void> {
    console.log('🔐 AuthService: Signing out user');
    
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear local session
    this.currentSession = null;
    this.clearSession();
  }

  // Session Management
  private persistSession(session: AuthSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaos_auth_session', JSON.stringify(session));
      localStorage.setItem('userRole', session.user.role);
      localStorage.setItem('userName', `${session.user.firstName} ${session.user.lastName}`);
      localStorage.setItem('userEmail', session.user.email);
    }
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kaos_auth_session');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
  }

  getCurrentSession(): AuthSession | null {
    if (this.currentSession) {
      return this.currentSession;
    }

    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem('kaos_auth_session');
      if (sessionData) {
        try {
          this.currentSession = JSON.parse(sessionData);
          return this.currentSession;
        } catch (error) {
          console.error('❌ AuthService: Failed to parse stored session');
          this.clearSession();
        }
      }
    }

    return null;
  }

  getCurrentUser(): AuthUser | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  // Authorization Methods
  hasPermission(permission: keyof Omit<typeof ROLE_PERMISSIONS.admin, 'pages'>): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = ROLE_PERMISSIONS[user.role];
    const value = permissions[permission];
    return typeof value === 'boolean' ? value : false;
  }

  canAccessPage(pageId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.pages.includes(pageId);
  }

  getVisibleTerritories(): string[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    // Admin, HR, and Manager can see all territories
    if (this.hasPermission('canViewAllTerritories')) {
      return []; // Empty array means "all territories"
    }

    // Sales rep can only see assigned territories
    return user.territories || [];
  }

  canViewLead(leadTerritoryId?: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin, HR, and Manager can see all leads
    if (this.hasPermission('canViewAllLeads')) {
      return true;
    }

    // Sales rep can only see leads in their territories
    if (!leadTerritoryId) return false;
    return (user.territories || []).includes(leadTerritoryId);
  }

  // Territory filtering for sales reps
  async getFilteredTerritories() {
    const visibleTerritoryIds = this.getVisibleTerritories();
    
    let query = supabase.from('territories').select('*');
    
    // If not empty array (meaning restricted access), filter by territory IDs
    if (visibleTerritoryIds.length > 0) {
      query = query.in('id', visibleTerritoryIds);
    }
    
    return query;
  }

  // Lead filtering for sales reps
  async getFilteredLeads() {
    const visibleTerritoryIds = this.getVisibleTerritories();
    
    let query = supabase.from('leads').select('*');
    
    // If not empty array (meaning restricted access), filter by territory IDs
    if (visibleTerritoryIds.length > 0) {
      query = query.in('territory_id', visibleTerritoryIds);
    }
    
    return query;
  }

  // Role-based dashboard redirect
  getDefaultRedirectPath(): string {
    const user = this.getCurrentUser();
    if (!user) return '/';

    switch (user.role) {
      case 'admin':
        return '/admin'; // Admin goes to admin dashboard
      case 'manager':
        return '/management'; // Manager goes to management dashboard
      case 'sales_rep':
        return '/leads'; // Sales rep goes to leads (their main focus)
      case 'hr':
        return '/admin'; // HR goes to admin dashboard
      default:
        return '/dashboard';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Convenience functions
export const getCurrentUser = () => authService.getCurrentUser();
export const getCurrentSession = () => authService.getCurrentSession();
export const hasPermission = (permission: keyof Omit<typeof ROLE_PERMISSIONS.admin, 'pages'>) => 
  authService.hasPermission(permission);
export const canAccessPage = (pageId: string) => authService.canAccessPage(pageId);
export const getVisibleTerritories = () => authService.getVisibleTerritories();
export const canViewLead = (leadTerritoryId?: string) => authService.canViewLead(leadTerritoryId);
