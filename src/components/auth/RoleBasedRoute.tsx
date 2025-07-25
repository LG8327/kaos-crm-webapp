// src/components/auth/RoleBasedRoute.tsx - Route protection component
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, UserRole } from '../../lib/auth-service';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  pageId?: string;
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  pageId,
  fallbackPath = '/dashboard'
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      const user = authService.getCurrentUser();

      // Not authenticated
      if (!user) {
        router.push('/');
        return;
      }

      // Check role-based access
      const hasRoleAccess = allowedRoles.includes(user.role);
      
      // Check page-specific access if pageId provided
      const hasPageAccess = pageId ? authService.canAccessPage(pageId) : true;

      const authorized = hasRoleAccess && hasPageAccess;

      if (!authorized) {
        console.log(`🚫 Access denied for role ${user.role} to page ${pageId}`);
        router.push(fallbackPath);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuthorization();
  }, [allowedRoles, pageId, fallbackPath, router]);

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Checking permissions...</div>
      </div>
    );
  }

  // If authorized, render children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Should not reach here due to redirect, but just in case
  return null;
};

// Example usage in pages:

// Admin page protection
export const AdminPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['admin', 'hr']} pageId="admin">
    {children}
  </RoleBasedRoute>
);

// Management page protection  
export const ManagementPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['manager', 'admin']} pageId="management">
    {children}
  </RoleBasedRoute>
);

// Sales rep restricted territories component
export const TerritoryFilteredComponent: React.FC = () => {
  const [territories, setTerritories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTerritories = async () => {
      try {
        const { data, error } = await authService.getFilteredTerritories();
        
        if (error) {
          console.error('Error loading territories:', error);
          return;
        }

        setTerritories(data || []);
      } catch (error) {
        console.error('Error loading territories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTerritories();
  }, []);

  if (loading) {
    return <div className="text-white">Loading territories...</div>;
  }

  const user = authService.getCurrentUser();
  const canViewAll = authService.hasPermission('canViewAllTerritories');

  return (
    <div className="p-4">
      <h2 className="text-white text-xl mb-4">
        {canViewAll ? 'All Territories' : 'My Territories'}
      </h2>
      
      {user?.role === 'sales_rep' && (
        <p className="text-gray-400 mb-4">
          Showing territories assigned to you ({territories.length} total)
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {territories.map((territory: any) => (
          <div key={territory.id} className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold">{territory.name}</h3>
            <p className="text-gray-400">{territory.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
