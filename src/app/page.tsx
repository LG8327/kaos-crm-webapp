'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase'
import { LoginView } from '@/components/auth/LoginView'

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 LoginPage: Checking existing authentication...')
      
      const user = await getCurrentUser()
      
      if (user) {
        console.log('✅ LoginPage: User already authenticated, redirecting to dashboard')
        setIsAuthenticated(true)
        router.push('/dashboard')
        return
      }
      
      console.log('❌ LoginPage: User not authenticated, showing login form')
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLoginSuccess = () => {
    console.log('✅ LoginView: Login successful, redirecting to dashboard')
    setIsAuthenticated(true)
    router.push('/dashboard')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    )
  }

  // Show login form
  return <LoginView onLoginSuccess={handleLoginSuccess} />
}
