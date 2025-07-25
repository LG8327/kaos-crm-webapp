'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TerritoryMap } from './TerritoryMap';
import { AddTerritoryModal } from './AddTerritoryModal';
import { 
  MapPin, 
  Plus, 
  Users, 
  Settings,
  BarChart3,
  Filter,
  Search,
  Map,
  List,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Territory {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  assigned_to_id?: string;
  boundaries?: {
    type: string;
    coordinates: number[][][];
  };
  center_lat?: number;
  center_lng?: number;
  zoom_level?: number;
  assigned_user?: {
    name: string;
    email: string;
  };
  lead_count?: number;
  hot_leads?: number;
  total_value?: number;
}

export const TerritoriesManagement: React.FC = () => {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('territories')
        .select(`
          *,
          assigned_user:users(name, email)
        `)
        .order('name');

      if (error) throw error;

      // Add mock lead counts for demo
      const territoriesWithStats = data?.map(territory => ({
        ...territory,
        lead_count: Math.floor(Math.random() * 20) + 1,
        hot_leads: Math.floor(Math.random() * 5),
        total_value: Math.floor(Math.random() * 100000) + 10000
      })) || [];

      setTerritories(territoriesWithStats);
    } catch (error) {
      console.error('Error loading territories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerritorySelect = (territory: Territory) => {
    setSelectedTerritory(territory);
    setViewMode('map'); // Switch to map view
    console.log('Selected territory:', territory);
  };

  const handleAddSuccess = () => {
    loadTerritories();
  };

  const filteredTerritories = territories.filter(territory => {
    const matchesSearch = territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territory.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && territory.is_active) ||
                         (filterStatus === 'inactive' && !territory.is_active);
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Controls Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode === 'map'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Territory
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search territories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Territories</p>
                <p className="text-2xl font-bold text-white">{territories.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Territories</p>
                <p className="text-2xl font-bold text-white">{territories.filter(t => t.is_active).length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-white">{territories.reduce((sum, t) => sum + (t.lead_count || 0), 0)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Assigned</p>
                <p className="text-2xl font-bold text-white">{territories.filter(t => t.assigned_to_id).length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'map' ? (
          <TerritoryMap
            territories={filteredTerritories}
            selectedTerritory={selectedTerritory}
            onTerritorySelect={handleTerritorySelect}
          />
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Territory List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Territory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Leads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTerritories.map(territory => (
                    <tr key={territory.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: territory.color }}
                          ></div>
                          <div>
                            <div className="text-white font-medium">{territory.name}</div>
                            {territory.description && (
                              <div className="text-gray-400 text-sm">{territory.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {territory.assigned_user?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {territory.lead_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        ${(territory.total_value || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          territory.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {territory.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTerritorySelect(territory)}
                            className="p-1 text-purple-400 hover:text-purple-300"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-blue-400 hover:text-blue-300">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Territory Modal */}
      {showAddModal && (
        <AddTerritoryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};
