/**
 * Simple global authentication store
 * This provides immediate access to authentication state without localStorage timing issues
 */

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
}

interface AuthStoreState {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
}

class AuthenticationStore {
  private state: AuthStoreState = {
    isAuthenticated: false,
    user: null,
    isLoading: true
  }

  private listeners: Array<(state: AuthStoreState) => void> = []

  /**
   * Set authentication state (called after successful login)
   */
  setAuthenticated(user: AuthUser) {
    console.log('🔐 AuthStore: Setting authenticated user:', user.email)
    this.state = {
      isAuthenticated: true,
      user,
      isLoading: false
    }
    this.notifyListeners()
  }

  /**
   * Clear authentication state (called after logout)
   */
  clearAuthenticated() {
    console.log('🔐 AuthStore: Clearing authentication')
    this.state = {
      isAuthenticated: false,
      user: null,
      isLoading: false
    }
    this.notifyListeners()
  }

  /**
   * Get current authentication state
   */
  getState(): AuthStoreState {
    return { ...this.state }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    console.log('🔍 AuthStore: isAuthenticated check:', this.state.isAuthenticated)
    return this.state.isAuthenticated
  }

  /**
   * Get current user
   */
  getUser(): AuthUser | null {
    return this.state.user
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean) {
    this.state.isLoading = loading
    this.notifyListeners()
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AuthStoreState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  /**
   * Initialize from localStorage (called on app start)
   */
  initializeFromStorage() {
    console.log('🔍 AuthStore: Initializing from localStorage')
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('demo_user')
      if (stored) {
        try {
          const user = JSON.parse(stored)
          console.log('✅ AuthStore: Found stored user:', user.email)
          this.setAuthenticated(user)
          return true
        } catch (e) {
          console.error('❌ AuthStore: Error parsing stored user:', e)
          localStorage.removeItem('demo_user')
        }
      }
    }
    
    this.state.isLoading = false
    this.notifyListeners()
    return false
  }

  /**
   * Reset store (emergency reset)
   */
  reset() {
    console.log('🚨 AuthStore: Emergency reset')
    this.state = {
      isAuthenticated: false,
      user: null,
      isLoading: false
    }
    this.notifyListeners()
  }
}

// Export singleton instance
export const authStore = new AuthenticationStore()
