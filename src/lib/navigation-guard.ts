// Route navigation guard to prevent redirect loops
// This tracks navigation state to prevent infinite redirects between login and dashboard

let lastRedirectTime = 0
let lastRedirectPath = ''
let redirectCount = 0

export class NavigationGuard {
  /**
   * Check if a redirect should be allowed to prevent loops
   */
  static shouldAllowRedirect(toPath: string): boolean {
    const now = Date.now()
    const timeSinceLastRedirect = now - lastRedirectTime
    
    // If same path was redirected to recently, block it
    if (lastRedirectPath === toPath && timeSinceLastRedirect < 500) {
      console.log('🚫 NavigationGuard: Blocking rapid redirect to same path:', toPath)
      return false
    }
    
    // Reset counter if enough time has passed
    if (timeSinceLastRedirect > 2000) {
      redirectCount = 0
    }
    
    // Block if too many redirects in short time
    if (redirectCount > 3) {
      console.log('🚫 NavigationGuard: Blocking due to too many redirects:', redirectCount)
      return false
    }
    
    // Allow redirect
    lastRedirectTime = now
    lastRedirectPath = toPath
    redirectCount++
    
    console.log('✅ NavigationGuard: Allowing redirect to:', toPath, 'Count:', redirectCount)
    return true
  }
  
  /**
   * Reset the navigation guard state
   */
  static reset() {
    lastRedirectTime = 0
    lastRedirectPath = ''
    redirectCount = 0
    console.log('🔄 NavigationGuard: State reset')
  }
  
  /**
   * Get current redirect count (for debugging)
   */
  static getRedirectCount(): number {
    return redirectCount
  }
}
