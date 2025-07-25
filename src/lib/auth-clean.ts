/**
 * Authentication flow implementation that matches iOS app behavior
 * 
 * This file contains the complete authentication flow:
 * 1. Email/password validation
 * 2. Supabase authentication (with demo fallback)
 * 3. User profile verification
 * 4. Session management
 * 5. Role-based access control
 * 6. Logout functionality
 */

import { auth, supabase } from '@/lib/supabase'
import { DemoAuth } from './demo-auth'
import { AuthState } from './auth-state'

// Check if we're in demo mode (Supabase not configured)
const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo') || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                   !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

console.log('🔧 AuthService: Environment check:', {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set',
  isDemoMode
})

// Display demo mode message if in demo mode
if (isDemoMode) {
  console.log('🔧 KAOS CRM: Running in demo mode - Supabase credentials not configured')
  console.log('📋 To connect to your iOS app database:')
  console.log('   1. Get your Supabase URL and anon key from your project')
  console.log('   2. Update .env.local with your actual credentials')  
  console.log('   3. Restart the development server')
}

export interface AuthResult {
  success: boolean
  user?: any
  profile?: any
  error?: string
}

/**
 * AuthService - Complete authentication management system
 * Handles both production Supabase and demo authentication
 */
export class AuthService {
  /**
   * Sign in user with email and password
   * Validates input and handles both Supabase and demo auth
   */
  static async signIn(email: string, password: string): Promise<AuthResult> {
    console.log('🔐 AuthService: Starting sign in for:', email)
    
    try {
      // Clear any cached auth state since we're doing a fresh login
      AuthState.clearCache()
      
      // Email validation (matches iOS app validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        }
      }

      if (password.length < 1) {
        return {
          success: false,
          error: 'Password is required'
        }
      }

      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        console.log('🔧 Using demo authentication - Supabase not configured')
        const result = await DemoAuth.signIn(email, password)
        if (result.success) {
          AuthState.setCachedResult(result)
        }
        return result
      }

      // Production Supabase authentication
      console.log('🔐 Using production Supabase authentication')
      const { data, error } = await auth.signIn({
        email,
        password
      })

      if (error) {
        console.error('❌ Supabase auth error:', error.message)
        return {
          success: false,
          error: error.message
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Authentication failed'
        }
      }

      // Get user profile with role information (matches iOS user management)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('❌ Profile fetch error:', profileError.message)
        return {
          success: false,
          error: 'Failed to load user profile'
        }
      }

      const result = {
        success: true,
        user: data.user,
        profile
      }
      
      AuthState.setCachedResult(result)
      return result

    } catch (error: any) {
      console.error('❌ AuthService: Sign in error:', error)
      return {
        success: false,
        error: error.message || 'Authentication failed'
      }
    }
  }

  /**
   * Get current user session (matches iOS session management)
   */
  static async getCurrentSession(): Promise<AuthResult> {
    console.log('🔍 AuthService: getCurrentSession called')
    
    // Prevent concurrent auth checks that cause redirect loops
    if (AuthState.isCheckInProgress()) {
      console.log('🔄 AuthService: Auth check already in progress, waiting...')
      await new Promise(resolve => setTimeout(resolve, 100))
      const cached = AuthState.getCachedResult()
      if (cached) return cached
    }

    // Check for cached result first
    const cached = AuthState.getCachedResult()
    if (cached) {
      console.log('🔄 AuthService: Using cached session result')
      return cached
    }

    AuthState.setCheckInProgress(true)

    try {
      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        console.log('🔍 AuthService: Using demo mode for session check')
        const result = await DemoAuth.getCurrentSession()
        console.log('🔍 AuthService: Demo session result:', result)
        AuthState.setCachedResult(result)
        return result
      }

      console.log('🔍 AuthService: Using production Supabase for session check')
      // Production Supabase session check
      const { data: { session } } = await auth.getSession()
      
      if (!session?.user) {
        console.log('❌ AuthService: No Supabase session found')
        const result = {
          success: false,
          error: 'No active session'
        }
        AuthState.setCachedResult(result)
        return result
      }

      // Get user profile with role information (matches iOS user management)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('❌ AuthService: Profile fetch error:', error.message)
        const result = {
          success: false,
          error: 'Failed to load user profile'
        }
        AuthState.setCachedResult(result)
        return result
      }

      const result = {
        success: true,
        user: session.user,
        profile
      }
      
      AuthState.setCachedResult(result)
      return result

    } catch (error: any) {
      console.error('❌ AuthService: getCurrentSession error:', error)
      const result = {
        success: false,
        error: error.message || 'Session check failed'
      }
      AuthState.setCachedResult(result)
      return result
    } finally {
      AuthState.setCheckInProgress(false)
    }
  }

  /**
   * Sign out user (matches iOS logout flow)
   */
  static async signOut(): Promise<AuthResult> {
    console.log('🔐 AuthService: Starting sign out')
    
    try {
      // Clear cached auth state
      AuthState.clearCache()
      
      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        console.log('🔧 Using demo sign out')
        return await DemoAuth.signOut()
      }

      // Production Supabase sign out
      console.log('🔐 Using production Supabase sign out')
      const { error } = await auth.signOut()
      
      if (error) {
        console.error('❌ Supabase sign out error:', error.message)
        return {
          success: false,
          error: error.message
        }
      }

      return { success: true }

    } catch (error: any) {
      console.error('❌ AuthService: Sign out error:', error)
      return {
        success: false,
        error: error.message || 'Sign out failed'
      }
    }
  }

  /**
   * Check if currently in demo mode
   */
  static isDemoMode(): boolean {
    return isDemoMode
  }

  /**
   * Get current user (convenience method)
   */
  static getCurrentUser() {
    if (isDemoMode) {
      return DemoAuth.getCurrentUser()
    }
    // For production, would return current Supabase user
    return null
  }
}
