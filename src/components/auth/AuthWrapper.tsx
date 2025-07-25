'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { AuthState } from '@/lib/auth-state'
import { NavigationGuard } from '@/lib/navigation-guard'
import { RedirectLoopPrevention } from '@/lib/redirect-loop-fix'
import { AuthRouter } from '@/lib/auth-router'
import { authStore } from '@/lib/auth-store'
import { auth } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AuthWrapper: Checking authentication...')
      
      // Set current route for AuthRouter
      AuthRouter.setCurrentRoute('dashboard')
      
      // Small delay to ensure localStorage is ready (particularly important after login redirect)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Prevent concurrent auth checks to avoid redirect loops
      if (AuthState.isCheckInProgress()) {
        console.log('🔄 AuthWrapper: Auth check already in progress, skipping')
        return
      }

      try {
        console.log('🔍 AuthWrapper: Starting authentication check...')
        
        // FOR DEMO MODE: Simple localStorage check first
        if (AuthService.isDemoMode()) {
          console.log('� AuthWrapper: Demo mode detected, checking localStorage directly')
          const demoUser = localStorage.getItem('demo_user')
          if (demoUser) {
            try {
              const user = JSON.parse(demoUser)
              console.log('✅ AuthWrapper: Demo user found in localStorage:', user.email)
              setUser(user as any)
              setUserProfile(user)
              setLoading(false)
              return
            } catch (e) {
              console.error('❌ AuthWrapper: Error parsing demo user:', e)
              localStorage.removeItem('demo_user')
            }
          } else {
            console.log('❌ AuthWrapper: No demo user in localStorage, redirecting to login')
            AuthRouter.navigateToLogin(router, 'No demo user found')
            return
          }
        }
        
        // Production Supabase authentication check
        console.log('🔍 AuthWrapper: Checking production Supabase authentication...')
        const result = await AuthService.getCurrentSession()
        console.log('🔍 AuthWrapper: Session check result:', result)
        
        if (!result.success) {
          console.log('❌ AuthWrapper: No valid session, redirecting to login')
          console.log('❌ AuthWrapper: Detailed failure reason:', result.error)
          AuthRouter.navigateToLogin(router, `No valid session: ${result.error}`)
          return
        }

        console.log('✅ AuthWrapper: Session valid, setting authenticated state')
        setUser(result.user)
        setUserProfile(result.profile)
        setLoading(false)

      } catch (error) {
        console.error('❌ AuthWrapper: Auth check failed:', error)
        // Redirect to login with loop prevention
        if (RedirectLoopPrevention.shouldAllowRedirect('/')) {
          setTimeout(() => {
            router.push('/')
          }, 300)
        } else {
          console.log('🚫 AuthWrapper: Redirect blocked to prevent loop')
          setLoading(false)
        }
      }
    }

    checkAuth()

    // Only listen for Supabase auth state changes if not in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log('🔍 AuthWrapper: Demo mode:', isDemoMode)
    
    if (!isDemoMode) {
      // Listen for auth state changes (matches iOS real-time auth)
      const { data: { subscription } } = auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔍 AuthWrapper: Supabase auth state change:', event)
          if (event === 'SIGNED_OUT' || !session?.user) {
            setUser(null)
            setUserProfile(null)
            setTimeout(() => {
              router.push('/')
            }, 100)
          } else if (event === 'SIGNED_IN' && session?.user) {
            // Re-verify session when signed in
            checkAuth()
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [router])

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #374151',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // User is authenticated and profile loaded
  if (user && userProfile) {
    return <>{children}</>
  }

  // Fallback - should not reach here due to redirects above
  return null
}
