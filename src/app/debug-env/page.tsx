'use client';

// Debug page to check environment variables in production
import React from 'react';

export default function DebugPage() {
  const envVars = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'NOT SET',
    MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.substring(0, 20) + '...' : 'NOT SET',
    MAPBOX_TOKEN_FULL_START: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.substring(0, 50) || 'NOT SET'
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl mb-4">Current Environment Variables:</h2>
        
        <div className="space-y-3">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
            <br />
            <code className="text-green-400">{envVars.SUPABASE_URL || 'NOT SET'}</code>
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
            <br />
            <code className="text-green-400">{envVars.SUPABASE_KEY}</code>
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:</strong>
            <br />
            <code className="text-green-400">{envVars.MAPBOX_TOKEN}</code>
          </div>
          
          <div>
            <strong>Mapbox Token Start (first 50 chars):</strong>
            <br />
            <code className="text-yellow-400">{envVars.MAPBOX_TOKEN_FULL_START}</code>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg mb-2">Expected Values:</h3>
          <div className="text-sm text-gray-400">
            <div>SUPABASE_URL should start with: https://abhjpjrwkhmktyneuslz.supabase.co</div>
            <div>SUPABASE_KEY should start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
            <div>MAPBOX_TOKEN should start with: pk.eyJ1IjoibGc4MzI3IiwiYSI6ImNtZDVhcnliNjBueDUyam9sMWQ0dXU5ZWkifQ...</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => window.location.href = '/territories'}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded"
        >
          Test Territories Page
        </button>
      </div>
    </div>
  );
}
