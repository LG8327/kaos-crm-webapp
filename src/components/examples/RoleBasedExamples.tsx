// Example: Updated LoginView with role-based redirect
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/auth-service';

export const EnhancedLoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.signIn(email, password);

      if (result.success) {
        console.log('✅ Login successful for:', result.session?.user.email);
        
        // Get role-based redirect path
        const redirectPath = authService.getDefaultRedirectPath();
        console.log('🎯 Redirecting to:', redirectPath);
        
        router.push(redirectPath);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { email: 'admin@kaos.com', role: 'Admin', landing: '/admin' },
    { email: 'manager@kaos.com', role: 'Manager', landing: '/management' },
    { email: 'sales@kaos.com', role: 'Sales Rep', landing: '/leads' },
    { email: 'hr@kaos.com', role: 'HR', landing: '/admin' }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">KAOS CRM</h2>
          <p className="text-gray-400">Role-Based Login System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-white text-sm font-semibold mb-3">Demo Users:</h3>
          <div className="space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => {
                  setEmail(user.email);
                  setPassword('password123');
                }}
                className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white text-sm font-medium">{user.email}</div>
                    <div className="text-gray-400 text-xs">{user.role}</div>
                  </div>
                  <div className="text-purple-400 text-xs">→ {user.landing}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Click any demo user to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  );
};

// Example: Protected Management page with role checking
export const ProtectedManagementPage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = authService.getCurrentUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      // Check if user can access management page
      if (!authService.canAccessPage('management')) {
        console.log(`🚫 Access denied: ${user.role} cannot access management page`);
        router.push(authService.getDefaultRedirectPath());
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Checking permissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-white text-2xl font-bold mb-4">Management Dashboard</h1>
      <p className="text-gray-400 mb-6">
        This page is only accessible to Managers and Admins
      </p>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-lg font-semibold mb-3">Your Access Level</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Role:</span>
            <span className="text-white">{authService.getCurrentUser()?.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Can manage users:</span>
            <span className={authService.hasPermission('canManageUsers') ? 'text-green-400' : 'text-red-400'}>
              {authService.hasPermission('canManageUsers') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Can view all territories:</span>
            <span className={authService.hasPermission('canViewAllTerritories') ? 'text-green-400' : 'text-red-400'}>
              {authService.hasPermission('canViewAllTerritories') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Can access admin:</span>
            <span className={authService.hasPermission('canAccessAdmin') ? 'text-green-400' : 'text-red-400'}>
              {authService.hasPermission('canAccessAdmin') ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
