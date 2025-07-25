// Shared business logic utilities that mirror iOS app functionality

import { Lead, Territory, User, LeadActivity, Meeting } from '@/types'

/**
 * Business logic utilities shared between web and iOS apps
 * These functions implement the same validation and processing rules
 * as the iOS Swift application
 */

// Lead Management Utilities
export class LeadManager {
  /**
   * Validate lead data before saving (matches iOS validation)
   */
  static validateLead(lead: Partial<Lead>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!lead.firstName?.trim()) {
      errors.push('First name is required')
    }

    if (!lead.lastName?.trim()) {
      errors.push('Last name is required')
    }

    if (lead.email && !this.isValidEmail(lead.email)) {
      errors.push('Please enter a valid email address')
    }

    if (lead.phone && !this.isValidPhone(lead.phone)) {
      errors.push('Please enter a valid phone number')
    }

    if (lead.value && lead.value < 0) {
      errors.push('Lead value cannot be negative')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Calculate lead score based on priority, status, and value
   * (Same algorithm as iOS app)
   */
  static calculateLeadScore(lead: Lead): number {
    let score = 0

    // Base score by status
    const statusScores = {
      new: 10,
      contacted: 25,
      qualified: 50,
      proposal: 75,
      closed_won: 100,
      closed_lost: 0
    }
    score += statusScores[lead.status] || 0

    // Priority multiplier
    const priorityMultipliers = {
      low: 1.0,
      medium: 1.5,
      high: 2.0
    }
    score *= priorityMultipliers[lead.priority] || 1.0

    // Value bonus (scaled)
    if (lead.value && lead.value > 0) {
      score += Math.min(lead.value / 1000, 50) // Max 50 points from value
    }

    return Math.round(score)
  }

  /**
   * Get next suggested action for a lead
   */
  static getNextAction(lead: Lead): string {
    const daysSinceUpdate = Math.floor(
      (Date.now() - lead.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    switch (lead.status) {
      case 'new':
        return daysSinceUpdate > 1 ? 'Make initial contact' : 'Schedule follow-up call'
      case 'contacted':
        return daysSinceUpdate > 3 ? 'Send follow-up email' : 'Qualify lead needs'
      case 'qualified':
        return 'Prepare and send proposal'
      case 'proposal':
        return daysSinceUpdate > 7 ? 'Follow up on proposal' : 'Schedule closing meeting'
      case 'closed_won':
        return 'Schedule onboarding'
      case 'closed_lost':
        return 'Add to nurture campaign'
      default:
        return 'Review lead status'
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }
}

// Territory Management Utilities
export class TerritoryManager {
  /**
   * Check if a coordinate point is within a territory boundary
   * Uses the same point-in-polygon algorithm as iOS app
   */
  static isPointInTerritory(
    latitude: number,
    longitude: number,
    territory: Territory
  ): boolean {
    const coordinates = territory.coordinates
    if (coordinates.length < 3) return false

    let isInside = false
    let j = coordinates.length - 1

    for (let i = 0; i < coordinates.length; i++) {
      if (
        coordinates[i].latitude > latitude !== coordinates[j].latitude > latitude &&
        longitude <
          ((coordinates[j].longitude - coordinates[i].longitude) *
            (latitude - coordinates[i].latitude)) /
            (coordinates[j].latitude - coordinates[i].latitude) +
            coordinates[i].longitude
      ) {
        isInside = !isInside
      }
      j = i
    }

    return isInside
  }

  /**
   * Calculate territory area in square kilometers
   */
  static calculateTerritoryArea(territory: Territory): number {
    const coordinates = territory.coordinates
    if (coordinates.length < 3) return 0

    let area = 0
    const earthRadius = 6371 // km

    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length
      const lat1 = (coordinates[i].latitude * Math.PI) / 180
      const lat2 = (coordinates[j].latitude * Math.PI) / 180
      const lng1 = (coordinates[i].longitude * Math.PI) / 180
      const lng2 = (coordinates[j].longitude * Math.PI) / 180

      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2))
    }

    area = Math.abs(area * earthRadius * earthRadius / 2)
    return Math.round(area * 100) / 100
  }

  /**
   * Find the best territory assignment for a lead based on location
   */
  static findBestTerritoryForLead(
    lead: Lead,
    territories: Territory[]
  ): Territory | null {
    if (!lead.latitude || !lead.longitude) return null

    // Find territories that contain this point
    const containingTerritories = territories.filter(territory =>
      territory.isActive &&
      this.isPointInTerritory(lead.latitude!, lead.longitude!, territory)
    )

    if (containingTerritories.length === 0) return null
    if (containingTerritories.length === 1) return containingTerritories[0]

    // If multiple territories contain the point, choose the smallest one
    return containingTerritories.reduce((smallest, current) =>
      this.calculateTerritoryArea(current) < this.calculateTerritoryArea(smallest)
        ? current
        : smallest
    )
  }
}

// Analytics and Reporting Utilities
export class AnalyticsManager {
  /**
   * Calculate conversion rate for leads
   */
  static calculateConversionRate(leads: Lead[]): number {
    const totalLeads = leads.length
    if (totalLeads === 0) return 0

    const closedWonLeads = leads.filter(lead => lead.status === 'closed_won').length
    return Math.round((closedWonLeads / totalLeads) * 100 * 100) / 100
  }

  /**
   * Calculate average deal size
   */
  static calculateAverageDealSize(leads: Lead[]): number {
    const closedWonLeads = leads.filter(
      lead => lead.status === 'closed_won' && lead.value && lead.value > 0
    )

    if (closedWonLeads.length === 0) return 0

    const totalValue = closedWonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)
    return Math.round(totalValue / closedWonLeads.length)
  }

  /**
   * Get lead velocity (average days from new to closed_won)
   */
  static calculateLeadVelocity(leads: Lead[], activities: LeadActivity[]): number {
    const closedWonLeads = leads.filter(lead => lead.status === 'closed_won')
    if (closedWonLeads.length === 0) return 0

    let totalDays = 0
    let validLeads = 0

    closedWonLeads.forEach(lead => {
      const leadActivities = activities
        .filter(activity => activity.leadId === lead.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      if (leadActivities.length > 0) {
        const firstActivity = leadActivities[0]
        const daysDiff = Math.floor(
          (lead.updatedAt.getTime() - firstActivity.createdAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
        totalDays += daysDiff
        validLeads++
      }
    })

    return validLeads > 0 ? Math.round(totalDays / validLeads) : 0
  }

  /**
   * Generate territory performance report
   */
  static generateTerritoryReport(
    territory: Territory,
    leads: Lead[]
  ): {
    totalLeads: number
    activeLeads: number
    closedWonLeads: number
    totalValue: number
    conversionRate: number
    averageDealSize: number
  } {
    const territoryLeads = leads.filter(lead => lead.territoryId === territory.id)
    const activeLeads = territoryLeads.filter(lead => 
      !['closed_won', 'closed_lost'].includes(lead.status)
    )
    const closedWonLeads = territoryLeads.filter(lead => lead.status === 'closed_won')
    const totalValue = closedWonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0)

    return {
      totalLeads: territoryLeads.length,
      activeLeads: activeLeads.length,
      closedWonLeads: closedWonLeads.length,
      totalValue,
      conversionRate: this.calculateConversionRate(territoryLeads),
      averageDealSize: this.calculateAverageDealSize(territoryLeads)
    }
  }
}

// Data Synchronization Utilities
export class SyncManager {
  /**
   * Check if an entity needs to be synced (matches iOS sync logic)
   */
  static needsSync(entity: { updatedAt: Date; lastSyncedAt?: Date }): boolean {
    if (!entity.lastSyncedAt) return true
    return entity.updatedAt.getTime() > entity.lastSyncedAt.getTime()
  }

  /**
   * Generate sync payload for API calls
   */
  static generateSyncPayload<T extends { id: string; updatedAt: Date }>(
    entities: T[],
    lastSyncTime?: Date
  ): { creates: T[]; updates: T[]; deletes: string[] } {
    const syncTime = lastSyncTime || new Date(0)

    const creates = entities.filter(entity => 
      !entity.id.startsWith('temp_') && entity.updatedAt > syncTime
    )

    const updates = entities.filter(entity => 
      entity.id.startsWith('temp_') === false && entity.updatedAt > syncTime
    )

    // In a real implementation, you'd track deleted entities
    const deletes: string[] = []

    return { creates, updates, deletes }
  }

  /**
   * Handle offline changes queue (matches iOS Core Data sync)
   */
  static mergeOfflineChanges<T extends { id: string; updatedAt: Date }>(
    localEntities: T[],
    serverEntities: T[]
  ): T[] {
    const merged = new Map<string, T>()

    // Start with server entities
    serverEntities.forEach(entity => {
      merged.set(entity.id, entity)
    })

    // Merge local changes (local wins if newer)
    localEntities.forEach(local => {
      const server = merged.get(local.id)
      if (!server || local.updatedAt > server.updatedAt) {
        merged.set(local.id, local)
      }
    })

    return Array.from(merged.values())
  }
}

// Export utility functions for direct use
export const businessLogic = {
  LeadManager,
  TerritoryManager,
  AnalyticsManager,
  SyncManager
}
