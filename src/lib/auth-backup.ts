/**
 * Authenti// Check if we're in demo mode (Supabase not configured)
const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo') || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                   !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

console.log('🔧 AuthService: Environment check:', {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set',
  isDemoMode
})n flow implementation that matches iOS app behavior
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

// Check if we're in demo mode (Supabase not configured)
const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo') || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project') ||
                   !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

export interface AuthResult {
  success: boolean
  user?: any
  profile?: any
  error?: string
}

/**
 * Authentication Service - matches iOS app authentication flow
 * Supports both production Supabase and demo mode for development
 */
export class AuthService {
  
  /**
   * Sign in user with email and password (matches iOS signIn flow)
   */
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Email validation (matches iOS app validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        }
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters'
        }
      }

      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        console.log('🔧 Using demo authentication - Supabase not configured')
        return await DemoAuth.signIn(email, password)
      }

      // Production Supabase authentication
      const { data, error: signInError } = await auth.signIn({ email, password })
      
      if (signInError) {
        // Handle specific error types (matches iOS error handling)
        switch (signInError.message) {
          case 'Invalid login credentials':
            return {
              success: false,
              error: 'Invalid email or password. Please try again.'
            }
          case 'Email not confirmed':
            return {
              success: false,
              error: 'Please check your email and click the confirmation link.'
            }
          case 'Too many requests':
            return {
              success: false,
              error: 'Too many login attempts. Please wait a few minutes and try again.'
            }
          default:
            return {
              success: false,
              error: signInError.message
            }
        }
      }

      // Verify user has access (matches iOS role checking)
      if (data.user) {
        // Get user profile to check role and status
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single()

        if (profileError) {
          return {
            success: false,
            error: 'Unable to verify user account. Please contact support.'
          }
        }

        if (!userProfile.is_active) {
          await auth.signOut() // Sign out if account is inactive
          return {
            success: false,
            error: 'Your account has been deactivated. Please contact support.'
          }
        }

        // Update last login timestamp (matches iOS behavior)
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', userProfile.id)

        return {
          success: true,
          user: data.user,
          profile: userProfile
        }
      }

      return {
        success: false,
        error: 'Authentication failed'
      }

    } catch (error: any) {
      console.error('AuthService.signIn error:', error)
      
      // Handle network errors specifically
      if (error.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection and Supabase configuration.'
        }
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      }
    }
  }

  /**
   * Get current user session (matches iOS session management)
   */
  static async getCurrentSession(): Promise<AuthResult> {
    console.log('🔍 AuthService: getCurrentSession called')
    try {
      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        console.log('🔍 AuthService: Using demo mode for session check')
        // Add small delay to ensure localStorage is properly accessible
        await new Promise(resolve => setTimeout(resolve, 50))
        const result = await DemoAuth.getCurrentSession()
        console.log('🔍 AuthService: Demo session result:', result)
        return result
      }

      console.log('🔍 AuthService: Using production Supabase for session check')
      // Production Supabase session check
      const { data: { session } } = await auth.getSession()
      
      if (!session?.user) {
        console.log('❌ AuthService: No Supabase session found')
        return {
          success: false,
          error: 'No active session'
        }
      }

      // Get user profile with role information (matches iOS user management)
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (error || !profile) {
        console.log('❌ AuthService: Failed to load user profile:', error)
        return {
          success: false,
          error: 'Failed to load user profile'
        }
      }

      if (!profile.is_active) {
        await auth.signOut()
        console.log('❌ AuthService: Account deactivated')
        return {
          success: false,
          error: 'Account deactivated'
        }
      }

      console.log('✅ AuthService: Production session valid')
      return {
        success: true,
        user: session.user,
        profile
      }

    } catch (error: any) {
      console.error('❌ AuthService: getCurrentSession error:', error)
      return {
        success: false,
        error: 'Session verification failed'
      }
    }
  }

  /**
   * Sign out user (matches iOS signOut flow)
   */
  static async signOut(): Promise<AuthResult> {
    try {
      // Use demo authentication if Supabase not configured
      if (isDemoMode) {
        return await DemoAuth.signOut()
      }

      // Production Supabase sign out
      await auth.signOut()
      return { success: true }
      
    } catch (error: any) {
      console.error('AuthService.signOut error:', error)
      return {
        success: false,
        error: 'Sign out failed'
      }
    }
  }

  /**
   * Check if running in demo mode
   */
  static isDemoMode(): boolean {
    return isDemoMode
  }
}
