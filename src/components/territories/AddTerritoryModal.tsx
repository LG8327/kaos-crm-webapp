'use client';

// src/components/territories/AddTerritoryModal.tsx - Updated with Mapbox boundary drawing
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Save, MapPin, Map } from 'lucide-react';
import { TerritoryBoundaryDrawer } from './TerritoryBoundaryDrawer';

interface AddTerritoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTerritoryModal: React.FC<AddTerritoryModalProps> = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Array<{id: string, name: string}>>([]);
  const [showBoundaryDrawer, setShowBoundaryDrawer] = useState(false);
  const [drawnBoundary, setDrawnBoundary] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#9333EA',
    is_active: true,
    assigned_to_id: '',
    center_lat: 29.7604, // Houston default
    center_lng: -95.3698,
    zoom_level: 10
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleBoundaryComplete = (boundary: any) => {
    setDrawnBoundary(boundary);
    
    // Calculate center from boundary if available
    if (boundary && boundary.geometry && boundary.geometry.coordinates) {
      const coordinates = boundary.geometry.coordinates[0];
      const centerLat = coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coordinates.length;
      const centerLng = coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coordinates.length;
      
      setFormData(prev => ({
        ...prev,
        center_lat: centerLat,
        center_lng: centerLng
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Territory name is required');
      return;
    }

    try {
      setIsLoading(true);
      
      const organizationId = localStorage.getItem('organizationId');
      
      const territoryData = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        color: formData.color,
        is_active: formData.is_active,
        assigned_to_id: formData.assigned_to_id || null,
        organization_id: organizationId,
        center_lat: formData.center_lat,
        center_lng: formData.center_lng,
        zoom_level: formData.zoom_level,
        boundaries: drawnBoundary?.geometry || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('territories')
        .insert([territoryData]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating territory:', error);
      alert('Error creating territory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random color
  const generateRandomColor = () => {
    const colors = [
      '#9333EA', '#EF4444', '#10B981', '#F59E0B', '#3B82F6',
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setFormData(prev => ({ ...prev, color: randomColor }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-purple-500" />
            Add New Territory
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Territory Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter territory name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-10 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={generateRandomColor}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Territory description (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Assign To
                    </label>
                    <select
                      value={formData.assigned_to_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select User (Optional)</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Geographic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Geographic Center</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.center_lat}
                      onChange={(e) => setFormData(prev => ({ ...prev, center_lat: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="29.7604"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.center_lng}
                      onChange={(e) => setFormData(prev => ({ ...prev, center_lng: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="-95.3698"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Default Zoom Level
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.zoom_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, zoom_level: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Territory Boundaries</h3>
                <button
                  type="button"
                  onClick={() => setShowBoundaryDrawer(!showBoundaryDrawer)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    showBoundaryDrawer
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Map className="h-4 w-4 mr-2" />
                  {showBoundaryDrawer ? 'Hide Map' : 'Draw Boundaries'}
                </button>
              </div>

              {showBoundaryDrawer && (
                <TerritoryBoundaryDrawer
                  onBoundaryComplete={handleBoundaryComplete}
                  center={[formData.center_lng, formData.center_lat]}
                />
              )}

              {drawnBoundary && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 text-sm font-medium">
                      ✓ Boundary drawn successfully
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawnBoundary(null)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {drawnBoundary.geometry.coordinates[0].length} boundary points
                  </p>
                </div>
              )}

              {!showBoundaryDrawer && !drawnBoundary && (
                <div className="h-96 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Draw territory boundaries</p>
                    <button
                      type="button"
                      onClick={() => setShowBoundaryDrawer(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Start Drawing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Territory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
