import { createClient } from '@supabase/supabase-js'

// Supabase configuration - same database as iOS app
const supabaseUrl = 'https://abhjpjrwkhmktyneuslz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaGpwanJ3a2hta3R5bmV1c2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODQ4MjQsImV4cCI6MjA2NzM2MDgyNH0.dUotGpB_jNMegT7PCmmU78ufY-zaep72DN4QaYfybHQ';

console.log('✅ KAOS CRM: Connected to Supabase database:', supabaseUrl)

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database table names - matching iOS Core Data model names
export const Tables = {
  USERS: 'users',
  TERRITORIES: 'territories', 
  LEADS: 'leads',
  LEAD_ACTIVITIES: 'lead_activities',
  MEETINGS: 'meetings',
  PROMOTIONS: 'promotions',
} as const

// Database helper functions
export const db = {
  // User operations
  users: {
    getAll: () => supabase.from(Tables.USERS).select('*'),
    getById: (id: string) => supabase.from(Tables.USERS).select('*').eq('id', id).single(),
    create: (user: any) => supabase.from(Tables.USERS).insert(user),
    update: (id: string, updates: any) => supabase.from(Tables.USERS).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.USERS).delete().eq('id', id),
  },

  // Territory operations
  territories: {
    getAll: () => supabase.from(Tables.TERRITORIES).select('*'),
    getById: (id: string) => supabase.from(Tables.TERRITORIES).select('*').eq('id', id).single(),
    getByUserId: (userId: string) => supabase.from(Tables.TERRITORIES).select('*').eq('user_id', userId),
    create: (territory: any) => supabase.from(Tables.TERRITORIES).insert(territory),
    update: (id: string, updates: any) => supabase.from(Tables.TERRITORIES).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.TERRITORIES).delete().eq('id', id),
  },

  // Lead operations  
  leads: {
    getAll: () => supabase.from(Tables.LEADS).select('*'),
    getById: (id: string) => supabase.from(Tables.LEADS).select('*').eq('id', id).single(),
    getByTerritoryId: (territoryId: string) => supabase.from(Tables.LEADS).select('*').eq('territory_id', territoryId),
    getByStatus: (status: string) => supabase.from(Tables.LEADS).select('*').eq('status', status),
    create: (lead: any) => supabase.from(Tables.LEADS).insert(lead),
    update: (id: string, updates: any) => supabase.from(Tables.LEADS).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.LEADS).delete().eq('id', id),
  },

  // Lead Activity operations
  leadActivities: {
    getAll: () => supabase.from(Tables.LEAD_ACTIVITIES).select('*'),
    getByLeadId: (leadId: string) => supabase.from(Tables.LEAD_ACTIVITIES).select('*').eq('lead_id', leadId),
    create: (activity: any) => supabase.from(Tables.LEAD_ACTIVITIES).insert(activity),
    update: (id: string, updates: any) => supabase.from(Tables.LEAD_ACTIVITIES).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.LEAD_ACTIVITIES).delete().eq('id', id),
  },

  // Meeting operations
  meetings: {
    getAll: () => supabase.from(Tables.MEETINGS).select('*'),
    getById: (id: string) => supabase.from(Tables.MEETINGS).select('*').eq('id', id).single(),
    getByUserId: (userId: string) => supabase.from(Tables.MEETINGS).select('*').eq('user_id', userId),
    getByLeadId: (leadId: string) => supabase.from(Tables.MEETINGS).select('*').eq('lead_id', leadId),
    create: (meeting: any) => supabase.from(Tables.MEETINGS).insert(meeting),
    update: (id: string, updates: any) => supabase.from(Tables.MEETINGS).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.MEETINGS).delete().eq('id', id),
  },

  // Promotion operations
  promotions: {
    getAll: () => supabase.from(Tables.PROMOTIONS).select('*'),
    getActive: () => supabase.from(Tables.PROMOTIONS).select('*').eq('is_active', true),
    getById: (id: string) => supabase.from(Tables.PROMOTIONS).select('*').eq('id', id).single(),
    create: (promotion: any) => supabase.from(Tables.PROMOTIONS).insert(promotion),
    update: (id: string, updates: any) => supabase.from(Tables.PROMOTIONS).update(updates).eq('id', id),
    delete: (id: string) => supabase.from(Tables.PROMOTIONS).delete().eq('id', id),
  },
}

// Authentication helpers
export const auth = {
  signIn: (credentials: { email: string; password: string }) => 
    supabase.auth.signInWithPassword(credentials),
  
  signOut: () => supabase.auth.signOut(),
  
  getUser: () => supabase.auth.getUser(),
  
  getSession: () => supabase.auth.getSession(),
  
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
}

// Real-time subscription helpers
export const realtime = {
  subscribeToTable: (table: string, callback: (payload: any) => void) =>
    supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe(),
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    localStorage.clear();
  }
  return { error };
};

// Database types matching the Swift app models
export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  state?: string;
  organization_id: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export interface DatabaseLead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
  status: string;
  value: number;
  notes?: string;
  lead_score: number;
  assigned_to_id?: string;
  territory_id?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  version: number;
}

export default supabase
