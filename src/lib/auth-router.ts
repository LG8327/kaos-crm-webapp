/**
 * Centralized Authentication Router
 * Prevents redirect loops by managing all authentication-based navigation
 * from a single source of truth
 */

interface AuthRouterState {
  isNavigating: boolean
  lastNavigation: number
  currentRoute: string
  preventedRedirects: number
}

class AuthenticationRouter {
  private state: AuthRouterState = {
    isNavigating: false,
    lastNavigation: 0,
    currentRoute: '',
    preventedRedirects: 0
  }

  private readonly NAVIGATION_COOLDOWN = 500 // 500ms between navigations (reduced from 2000ms)
  private readonly MAX_PREVENTED_REDIRECTS = 3

  /**
   * Check if navigation is currently safe
   */
  private canNavigate(): boolean {
    const now = Date.now()
    const timeSinceLastNav = now - this.state.lastNavigation
    
    if (this.state.isNavigating) {
      console.log('🚫 AuthRouter: Navigation already in progress')
      return false
    }

    if (timeSinceLastNav < this.NAVIGATION_COOLDOWN) {
      console.log(`🚫 AuthRouter: Navigation cooldown active (${timeSinceLastNav}ms / ${this.NAVIGATION_COOLDOWN}ms)`)
      this.state.preventedRedirects++
      return false
    }

    if (this.state.preventedRedirects >= this.MAX_PREVENTED_REDIRECTS) {
      console.log('🚨 AuthRouter: Too many prevented redirects, emergency reset needed')
      this.emergencyReset()
      return false
    }

    return true
  }

  /**
   * Navigate to login page (unauthenticated state)
   */
  navigateToLogin(router: any, reason: string = 'Authentication required'): boolean {
    console.log(`🔐 AuthRouter: Requesting navigation to login - ${reason}`)
    
    if (!this.canNavigate()) {
      return false
    }

    if (this.state.currentRoute === 'login') {
      console.log('ℹ️ AuthRouter: Already on login page')
      return false
    }

    this.state.isNavigating = true
    this.state.lastNavigation = Date.now()
    this.state.currentRoute = 'login'
    this.state.preventedRedirects = 0

    console.log('✅ AuthRouter: Navigating to login')
    router.push('/')
    
    // Clear navigation lock after a delay
    setTimeout(() => {
      this.state.isNavigating = false
    }, 1000)

    return true
  }

  /**
   * Navigate to dashboard (authenticated state)
   */
  navigateToDashboard(router: any, reason: string = 'Authentication successful'): boolean {
    console.log(`📊 AuthRouter: Requesting navigation to dashboard - ${reason}`)
    console.log('📊 AuthRouter: Current state:', this.getState())
    
    if (!this.canNavigate()) {
      console.log('❌ AuthRouter: Navigation blocked by canNavigate()')
      return false
    }

    if (this.state.currentRoute === 'dashboard') {
      console.log('ℹ️ AuthRouter: Already on dashboard page')
      return false
    }

    this.state.isNavigating = true
    this.state.lastNavigation = Date.now()
    this.state.currentRoute = 'dashboard'
    this.state.preventedRedirects = 0

    console.log('✅ AuthRouter: Navigating to dashboard')
    console.log('✅ AuthRouter: About to call router.push("/dashboard")')
    router.push('/dashboard')
    
    // Clear navigation lock after a delay
    setTimeout(() => {
      this.state.isNavigating = false
      console.log('🔓 AuthRouter: Navigation lock cleared')
    }, 1000)

    return true
  }

  /**
   * Update current route without navigation
   */
  setCurrentRoute(route: 'login' | 'dashboard') {
    this.state.currentRoute = route
    console.log(`📍 AuthRouter: Current route set to ${route}`)
  }

  /**
   * Get current navigation state for debugging
   */
  getState() {
    return { ...this.state }
  }

  /**
   * Emergency reset - clear all state and localStorage
   */
  emergencyReset() {
    console.log('🚨 AuthRouter: EMERGENCY RESET - Clearing all navigation state')
    this.state = {
      isNavigating: false,
      lastNavigation: 0,
      currentRoute: '',
      preventedRedirects: 0
    }
    
    // Clear related localStorage
    try {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('redirect_loop_prevention')
      localStorage.removeItem('navigation_guard')
      localStorage.removeItem('auth_state_cache')
    } catch (error) {
      console.error('AuthRouter: Error clearing localStorage:', error)
    }
  }

  /**
   * Reset state for fresh start
   */
  reset() {
    console.log('🔄 AuthRouter: Resetting navigation state')
    this.state.isNavigating = false
    this.state.preventedRedirects = 0
    this.state.lastNavigation = 0
  }
}

// Export singleton instance
export const AuthRouter = new AuthenticationRouter()
