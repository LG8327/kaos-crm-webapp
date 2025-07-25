/**
 * Simple Demo Authentication Hook
 * Bypasses all the complex timing issues by using a simple localStorage check
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DemoUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
}

export function useDemoAuth() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 useDemoAuth: Checking authentication...')
      
      // Simple localStorage check
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser)
          console.log('✅ useDemoAuth: Demo user found:', user.email)
          setUser(user)
          setIsAuthenticated(true)
          setIsLoading(false)
        } catch (e) {
          console.error('❌ useDemoAuth: Error parsing user:', e)
          localStorage.removeItem('demo_user')
          setIsAuthenticated(false)
          setIsLoading(false)
          // Redirect to login
          router.push('/')
        }
      } else {
        console.log('❌ useDemoAuth: No demo user found, redirecting to login')
        setIsAuthenticated(false)
        setIsLoading(false)
        // Redirect to login
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  const signOut = () => {
    console.log('🔐 useDemoAuth: Signing out...')
    localStorage.removeItem('demo_user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signOut
  }
}
