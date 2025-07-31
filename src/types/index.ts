// Core data types matching the iOS Core Data models

// Role types for user management
export type UserRole = 'Admin' | 'Director' | 'Manager' | 'Sales Rep';

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive: boolean
  territories?: Territory[]
  leads?: Lead[]
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

export interface Territory {
  id: string
  name: string
  description?: string
  coordinates: Coordinate[]
  color: string
  userId?: string
  user?: User
  leads?: Lead[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  address?: string
  latitude?: number
  longitude?: number
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost'
  priority: 'low' | 'medium' | 'high'
  value?: number
  notes?: string
  territoryId?: string
  territory?: Territory
  userId?: string
  user?: User
  activities?: LeadActivity[]
  meetings?: Meeting[]
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

export interface Meeting {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  location?: string
  meetingType: 'call' | 'in_person' | 'video' | 'other'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  leadId?: string
  lead?: Lead
  userId?: string
  user?: User
  notes?: string
  outcome?: string
  followUpRequired: boolean
  followUpDate?: Date
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

export interface LeadActivity {
  id: string
  title: string
  description?: string
  activityType: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'other'
  status: 'pending' | 'completed' | 'cancelled'
  dueDate?: Date
  completedDate?: Date
  leadId?: string
  lead?: Lead
  userId?: string
  user?: User
  notes?: string
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

export interface Promotion {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  isActive: boolean
  targetAudience?: string
  budget?: number
  results?: string
  createdAt: Date
  updatedAt: Date
  lastSyncedAt?: Date
  syncStatus?: 'synced' | 'pending' | 'error'
}

// Geographic types
export interface Coordinate {
  latitude: number
  longitude: number
}

export interface MapBounds {
  northeast: Coordinate
  southwest: Coordinate
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface LeadFormData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  address?: string
  status: Lead['status']
  priority: Lead['priority']
  value?: number
  notes?: string
  territoryId?: string
}

export interface TerritoryFormData {
  name: string
  description?: string
  coordinates: Coordinate[]
  color: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  role: User['role']
  isActive: boolean
}

// Dashboard/Analytics types
export interface DashboardStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  closedWonLeads: number
  totalValue: number
  conversionRate: number
  activeTerritories: number
  activeUsers: number
}

export interface LeadsByStatus {
  new: number
  contacted: number
  qualified: number
  proposal: number
  closed_won: number
  closed_lost: number
}

export interface LeadsByPriority {
  low: number
  medium: number
  high: number
}

// Filter and sort types
export interface LeadFilters {
  status?: Lead['status'][]
  priority?: Lead['priority'][]
  territoryId?: string
  userId?: string
  dateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

// Authentication types
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: User['role']
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
