'use client';

// src/components/leads/LeadDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  X, 
  Edit2, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  DollarSign,
  Target,
  User,
  Activity,
  Clock,
  Star
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
  status: string;
  value: number;
  notes?: string;
  lead_score: number;
  assigned_to_id?: string;
  territory_id?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  last_contact?: string;
  // Telecom-specific fields
  wireless_opp?: string;
  existing_video?: string;
  door_knock_allowed?: string;
  // Related data
  assigned_user?: {
    name: string;
    email: string;
  };
  territory?: {
    name: string;
    color: string;
  };
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(lead);
  const [users, setUsers] = useState<Array<{id: string, name: string}>>([]);
  const [territories, setTerritories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    loadUsers();
    loadTerritories();
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

  const loadTerritories = async () => {
    try {
      const { data, error } = await supabase
        .from('territories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTerritories(data || []);
    } catch (error) {
      console.error('Error loading territories:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const updateData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        status: formData.status,
        value: formData.value,
        notes: formData.notes,
        lead_score: formData.lead_score,
        assigned_to_id: formData.assigned_to_id,
        territory_id: formData.territory_id,
        wireless_opp: formData.wireless_opp,
        existing_video: formData.existing_video,
        door_knock_allowed: formData.door_knock_allowed,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id);

      if (error) throw error;

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error updating lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'warm': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'cold': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'solved':
      case 'won': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'lost': return 'text-gray-400 bg-gray-900/20 border-gray-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              {lead.company && (
                <p className="text-gray-400">{lead.company}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(lead);
                  }}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Lead Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white">{lead.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white">{lead.company || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.email || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.address || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white">{lead.city || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      State
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.state || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white">{lead.state || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      ZIP Code
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.zip || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, zip: parseInt(e.target.value) || undefined }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white">{lead.zip || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Add notes about this lead..."
                  />
                ) : (
                  <p className="text-white bg-gray-800/50 p-3 rounded-lg">
                    {lead.notes || 'No notes added'}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Value */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Lead Status</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Solved">Solved</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Lead Value
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-white text-lg font-semibold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                        {formatCurrency(lead.value)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Lead Score
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.lead_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, lead_score: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className={`text-lg font-semibold mr-3 ${getLeadScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              lead.lead_score >= 80 ? 'bg-green-500' :
                              lead.lead_score >= 60 ? 'bg-yellow-500' :
                              lead.lead_score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${lead.lead_score}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Assignment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Assigned To
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.assigned_to_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_id: e.target.value || undefined }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-white">
                          {lead.assigned_user?.name || 'Unassigned'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Territory
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.territory_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, territory_id: e.target.value || undefined }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">No Territory</option>
                        {territories.map(territory => (
                          <option key={territory.id} value={territory.id}>{territory.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-white">
                          {lead.territory?.name || 'No Territory'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">{formatDate(lead.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-white">{formatDate(lead.updated_at)}</span>
                  </div>
                  {lead.last_contact && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Contact:</span>
                      <span className="text-white">{formatDate(lead.last_contact)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Telecom-Specific Fields */}
              {isEditing && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Telecom Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Wireless Opportunity
                      </label>
                      <select
                        value={formData.wireless_opp || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, wireless_opp: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Not specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Maybe">Maybe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Existing Video
                      </label>
                      <select
                        value={formData.existing_video || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, existing_video: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Not specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Door Knock Allowed
                      </label>
                      <select
                        value={formData.door_knock_allowed || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, door_knock_allowed: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Not specified</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
