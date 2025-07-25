// Emergency fix to stop the infinite redirect loop
// This creates a simple flag-based solution to break the cycle

const REDIRECT_LOOP_KEY = 'redirect_loop_prevention'
const MAX_REDIRECTS = 3
const RESET_TIME = 5000 // 5 seconds

export class RedirectLoopPrevention {
  static shouldAllowRedirect(path: string): boolean {
    if (typeof window === 'undefined') return true

    const now = Date.now()
    const data = localStorage.getItem(REDIRECT_LOOP_KEY)
    
    let redirectData = { count: 0, lastTime: 0, lastPath: '' }
    
    if (data) {
      try {
        redirectData = JSON.parse(data)
      } catch (e) {
        // Invalid data, reset
        localStorage.removeItem(REDIRECT_LOOP_KEY)
      }
    }
    
    // Reset if enough time has passed
    if (now - redirectData.lastTime > RESET_TIME) {
      redirectData = { count: 0, lastTime: now, lastPath: path }
    }
    
    // Check if we're in a loop
    if (redirectData.count >= MAX_REDIRECTS && redirectData.lastPath === path) {
      console.log('🚫 REDIRECT LOOP DETECTED - BLOCKING:', path)
      return false
    }
    
    // Update redirect data
    redirectData.count++
    redirectData.lastTime = now
    redirectData.lastPath = path
    
    localStorage.setItem(REDIRECT_LOOP_KEY, JSON.stringify(redirectData))
    
    console.log('✅ Redirect allowed:', path, 'Count:', redirectData.count)
    return true
  }
  
  static reset() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REDIRECT_LOOP_KEY)
      console.log('🔄 Redirect loop prevention reset')
    }
  }
  
  static getStatus() {
    if (typeof window === 'undefined') return null
    
    const data = localStorage.getItem(REDIRECT_LOOP_KEY)
    if (!data) return null
    
    try {
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }
}
