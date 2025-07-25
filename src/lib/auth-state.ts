// Global authentication state management to prevent redirect loops
// This ensures consistent auth state across all components

let isAuthCheckInProgress = false
let lastAuthCheckResult: any = null
let lastAuthCheckTime = 0

export class AuthState {
  /**
   * Check if an auth verification is currently in progress
   */
  static isCheckInProgress(): boolean {
    return isAuthCheckInProgress
  }

  /**
   * Set auth check in progress state
   */
  static setCheckInProgress(inProgress: boolean): void {
    isAuthCheckInProgress = inProgress
  }

  /**
   * Get cached auth result if recent (within 5 seconds for better persistence)
   */
  static getCachedResult(): any | null {
    const now = Date.now()
    if (lastAuthCheckResult && (now - lastAuthCheckTime) < 5000) {
      console.log('🔄 AuthState: Using cached auth result')
      return lastAuthCheckResult
    }
    return null
  }

  /**
   * Cache auth result
   */
  static setCachedResult(result: any): void {
    lastAuthCheckResult = result
    lastAuthCheckTime = Date.now()
  }

  /**
   * Clear cached result (use when auth state changes)
   */
  static clearCache(): void {
    lastAuthCheckResult = null
    lastAuthCheckTime = 0
  }
}
