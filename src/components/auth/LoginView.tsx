// src/components/auth/LoginView.tsx
import React, { useState } from 'react';
import { supabase, getCurrentUser, DatabaseUser } from '../../lib/supabase';
import { Eye, EyeOff, Zap } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [showLightning, setShowLightning] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setShowLightning(true);

    try {
      console.log('🔐 LoginView: Starting login process...', { email });

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Fetch user data from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .eq('is_active', true)
        .single();

      if (userError || !userData) {
        throw new Error('User not found or inactive');
      }

      // Store user data in localStorage
      localStorage.setItem('userEmail', (userData as DatabaseUser).email);
      localStorage.setItem('userName', (userData as DatabaseUser).name || '');
      localStorage.setItem('userRole', (userData as DatabaseUser).role || 'Sales Rep');
      localStorage.setItem('userId', (userData as DatabaseUser).id);
      localStorage.setItem('organizationId', (userData as DatabaseUser).organization_id);
      localStorage.setItem('supabaseSession', JSON.stringify(authData.session));

      console.log('✅ LoginView: Login successful');
      
      // Lightning animation before success
      setTimeout(() => {
        setShowLightning(false);
        onLoginSuccess();
      }, 1000);

    } catch (error: any) {
      console.log('❌ LoginView: Login failed', error);
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
      setShowLightning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Lightning Effect */}
      {showLightning && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-1 h-32 bg-purple-400 transform rotate-45 animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-24 bg-blue-400 transform -rotate-12 animate-ping delay-150"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-28 bg-purple-500 transform rotate-12 animate-ping delay-300"></div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 relative z-20">
        {/* Logo Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Zap className="h-20 w-20 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 h-20 w-20 text-purple-300 animate-ping opacity-20">
                <Zap className="h-20 w-20" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Kaos CRM
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 font-medium">
            Next-Generation Territory Management
          </p>
          
          <div className="text-sm text-purple-400 font-medium tracking-wide">
            &ldquo;Conquer Chaos. Command Territory.&rdquo;
          </div>
        </div>

        {/* Database Connection Info */}
        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-green-300 font-semibold text-sm mb-2">✅ Connected to Supabase</h3>
          <div className="text-green-200 text-xs space-y-1">
            <p>Database: <strong>abhjpjrw...supabase.co</strong></p>
            <p>Status: <strong>Live Connection</strong></p>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              onMouseDown={() => setIsButtonPressed(true)}
              onMouseUp={() => setIsButtonPressed(false)}
              onMouseLeave={() => setIsButtonPressed(false)}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-purple-600 cursor-not-allowed'
                  : isButtonPressed
                  ? 'bg-purple-700 transform scale-95'
                  : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:scale-105'
              } backdrop-blur-sm`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                  {showLightning ? 'Authenticating...' : 'Signing in...'}
                </div>
              ) : (
                <span className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Sign in to Kaos
                </span>
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              onClick={() => {
                // TODO: Implement forgot password functionality
                alert('Forgot password functionality will be implemented');
              }}
            >
              Forgot your password?
            </button>
          </div>
        </form>

        {/* Copyright Footer */}
        <div className="text-center pt-8">
          <p className="text-xs text-gray-500">
            ©2025 Imperial Fidelis LLC Software Division. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
