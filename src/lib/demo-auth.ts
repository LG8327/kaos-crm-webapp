// Demo authentication for development when Supabase is not configured
// This allows developers to test the UI flow without needing actual Supabase credentials

import { authStore } from './auth-store'

export interface DemoUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'sales_rep' | 'hr'
  isActive: boolean
}

// Demo users for testing
const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'admin@kaos.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true
  },
  {
    id: '2', 
    email: 'manager@kaos.com',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
    isActive: true
  },
  {
    id: '3',
    email: 'sales@kaos.com', 
    firstName: 'Sales',
    lastName: 'Rep',
    role: 'sales_rep',
    isActive: true
  },
  {
    id: '4',
    email: 'hr@kaos.com',
    firstName: 'HR',
    lastName: 'User',
    role: 'hr',
    isActive: true
  }
]

let currentDemoUser: DemoUser | null = null

export class DemoAuth {
  static async signIn(email: string, password: string) {
    console.log('🔧 DemoAuth: Starting signIn process for:', email)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Find demo user
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      console.log('❌ DemoAuth: User not found:', email)
      return {
        success: false,
        error: 'Invalid email or password. Try: admin@kaos.com, manager@kaos.com, sales@kaos.com, or hr@kaos.com'
      }
    }

    if (!user.isActive) {
      console.log('❌ DemoAuth: User account deactivated:', email)
      return {
        success: false,
        error: 'Your account has been deactivated. Please contact support.'
      }
    }

    // Any password works in demo mode (but we still require one)
    if (!password || password.length < 1) {
      console.log('❌ DemoAuth: Password required')
      return {
        success: false,
        error: 'Password is required'
      }
    }

    // Store current user in localStorage for demo persistence (better than sessionStorage)
    currentDemoUser = user
    if (typeof window !== 'undefined') {
      const userData = JSON.stringify(user)
      localStorage.setItem('demo_user', userData)
      console.log('✅ DemoAuth: User data stored in localStorage:', userData)
      
      // Update global auth store immediately
      authStore.setAuthenticated(user)
      
      // Verify storage immediately
      const verification = localStorage.getItem('demo_user')
      console.log('🔍 DemoAuth: Verification - stored data:', verification ? 'found' : 'NOT FOUND')
      
      // Additional verification - try to parse it back
      if (verification) {
        try {
          const parsed = JSON.parse(verification)
          console.log('🔍 DemoAuth: Parsed verification - user email:', parsed.email)
        } catch (e) {
          console.error('❌ DemoAuth: Could not parse stored data:', e)
        }
      }
    }

    console.log('✅ DemoAuth: SignIn successful for:', user.email)
    return {
      success: true,
      user,
      profile: user
    }
  }

  static async getCurrentSession() {
    console.log('🔍 DemoAuth: Getting current session...')
    
    // First check the auth store (immediate access)
    if (authStore.isAuthenticated()) {
      const user = authStore.getUser()
      console.log('✅ DemoAuth: Session found in auth store:', user?.email)
      return {
        success: true,
        user,
        profile: user
      }
    }
    
    // Fallback to localStorage check
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('demo_user')
      console.log('🔍 DemoAuth: localStorage data:', stored ? 'found' : 'not found')
      console.log('🔍 DemoAuth: localStorage raw data:', stored)
      if (stored) {
        try {
          const user = JSON.parse(stored)
          currentDemoUser = user
          // Update auth store from localStorage
          authStore.setAuthenticated(user)
          console.log('✅ DemoAuth: Session found for user:', user.email)
          console.log('🔍 DemoAuth: Full user data:', user)
          console.log('🔍 DemoAuth: User active status:', user.isActive)
          return {
            success: true,
            user,
            profile: user
          }
        } catch (e) {
          console.log('❌ DemoAuth: Invalid stored data, clearing localStorage')
          console.error('❌ DemoAuth: Parse error:', e)
          // Invalid stored data, clear it
          localStorage.removeItem('demo_user')
          authStore.clearAuthenticated()
        }
      } else {
        console.log('🔍 DemoAuth: No data in localStorage, checking currentDemoUser variable...')
        if (currentDemoUser) {
          console.log('🔍 DemoAuth: Found currentDemoUser variable:', currentDemoUser.email)
          authStore.setAuthenticated(currentDemoUser)
          return {
            success: true,
            user: currentDemoUser,
            profile: currentDemoUser
          }
        }
      }
    }

    console.log('❌ DemoAuth: No valid session found')
    return {
      success: false,
      error: 'No active session'
    }
  }

  static async signOut() {
    console.log('🔧 DemoAuth: Signing out and clearing localStorage...')
    currentDemoUser = null
    authStore.clearAuthenticated()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user')
      console.log('✅ DemoAuth: localStorage cleared')
    }
    return { success: true }
  }

  static getCurrentUser() {
    return currentDemoUser
  }
}
