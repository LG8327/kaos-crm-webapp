// src/lib/role-utils.ts - Role-based utility functions

import { UserRole } from './auth-service';

// Role hierarchy for comparison (higher numbers = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'Sales Rep': 1,
  'Manager': 2,
  'Director': 3,
  'Admin': 4
};

// Check if a user role has equal or higher permissions than required role
export const hasRoleLevel = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Get role display name with appropriate styling
export const getRoleDisplayInfo = (role: UserRole) => {
  switch (role) {
    case 'Admin':
      return {
        name: 'Administrator',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        description: 'Full system access and user management'
      };
    case 'Director':
      return {
        name: 'Director',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200',
        description: 'Executive oversight and strategic management'
      };
    case 'Manager':
      return {
        name: 'Manager',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200',
        description: 'Team management and territory oversight'
      };
    case 'Sales Rep':
      return {
        name: 'Sales Representative',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        description: 'Lead management and territory coverage'
      };
    default:
      return {
        name: role,
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
        description: 'Standard user access'
      };
  }
};

// Check if role can assign/modify another role
export const canManageRole = (managerRole: UserRole, targetRole: UserRole): boolean => {
  // Admins can manage all roles
  if (managerRole === 'Admin') return true;
  
  // Directors can manage Manager and Sales Rep roles
  if (managerRole === 'Director') {
    return targetRole === 'Manager' || targetRole === 'Sales Rep';
  }
  
  // Managers can only manage Sales Rep roles
  if (managerRole === 'Manager') {
    return targetRole === 'Sales Rep';
  }
  
  // Sales Reps cannot manage any roles
  return false;
};

// Get available roles that a user can assign
export const getAssignableRoles = (managerRole: UserRole): UserRole[] => {
  switch (managerRole) {
    case 'Admin':
      return ['Admin', 'Director', 'Manager', 'Sales Rep'];
    case 'Director':
      return ['Manager', 'Sales Rep'];
    case 'Manager':
      return ['Sales Rep'];
    default:
      return [];
  }
};
