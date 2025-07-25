'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '../../lib/supabase'
import { MainDashboard } from '../../components/dashboard/MainDashboard'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Dashboard: Checking authentication...')
      
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        console.log('❌ Dashboard: User not authenticated, redirecting to login')
        router.push('/')
        return
      }
      
      console.log('✅ Dashboard: User authenticated:', currentUser.email)
      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    )
  }

  return <MainDashboard />
}
