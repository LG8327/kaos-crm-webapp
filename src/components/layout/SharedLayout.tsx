'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  MapPin, 
  Building2, 
  BarChart3, 
  FileText, 
  Settings,
  UserCircle,
  ChevronDown,
  Search,
  Bell,
  Shield
} from "lucide-react"

// Modern Sidebar Component (extracted from dashboard)
const ModernSidebar = ({ selectedTab }: { selectedTab: string }) => {
  const pathname = usePathname();
  
  const navigationItems = [
    { icon: Home, label: "Dashboard", active: pathname === '/dashboard', href: "/dashboard" },
    { icon: Users, label: "Team Management", active: pathname === '/management', href: "/management" },
    { icon: MapPin, label: "Territories", active: pathname === '/territories', href: "/territories" },
    { icon: Building2, label: "Leads", active: pathname === '/leads', href: "/leads" },
    { icon: Shield, label: "Admin", active: pathname === '/admin', href: "/admin" },
    { icon: Settings, label: "Settings", active: pathname === '/settings', href: "/settings" },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">KAOS CRM</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-500">System Admin</div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

// Modern Top Bar (extracted from dashboard)
const ModernTopBar = ({ title = "Dashboard Overview" }: { title?: string }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gray-400 rounded-full"></span>
        </button>
        
        {/* Profile */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  )
}

// Shared Layout Component
interface SharedLayoutProps {
  children: React.ReactNode;
  selectedTab: string;
  title?: string;
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({
  children,
  selectedTab,
  title
}) => {
  return (
    <div className="min-h-screen bg-white">
      <ModernSidebar selectedTab={selectedTab} />
      
      {/* Main Content Area */}
      <div className="ml-64">
        <ModernTopBar title="Dashboard" />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export { ModernSidebar, ModernTopBar }
