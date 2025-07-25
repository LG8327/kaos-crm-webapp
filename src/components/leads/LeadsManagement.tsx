'use client';

// src/components/leads/LeadsManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Target,
  Activity,
  MoreHorizontal,
  Star,
  Clock,
  User,
  ArrowUpDown,
  X
} from 'lucide-react';
import { LeadDetailModal } from './LeadDetailModal';
import { AddLeadModal } from './AddLeadModal';

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
  is_deleted: boolean;
  version: number;
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

interface FilterState {
  status: string;
  assignedTo: string;
  territory: string;
  dateRange: string;
  minValue: string;
  maxValue: string;
}

export const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(20);

  const [filters, setFilters] = useState<FilterState>({
    status: '',
    assignedTo: '',
    territory: '',
    dateRange: '',
    minValue: '',
    maxValue: ''
  });

  const [users, setUsers] = useState<Array<{id: string, name: string}>>([]);
  const [territories, setTerritories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    loadLeads();
    loadUsers();
    loadTerritories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, filters, sortBy, sortOrder]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          assigned_user:users!assigned_to_id(name, email),
          territory:territories!territory_id(name, color)
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const applyFilters = useCallback(() => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(lead => lead.assigned_to_id === filters.assignedTo);
    }

    // Territory filter
    if (filters.territory) {
      filtered = filtered.filter(lead => lead.territory_id === filters.territory);
    }

    // Value range filter
    if (filters.minValue) {
      filtered = filtered.filter(lead => lead.value >= parseFloat(filters.minValue));
    }
    if (filters.maxValue) {
      filtered = filtered.filter(lead => lead.value <= parseFloat(filters.maxValue));
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      if (filters.dateRange !== '') {
        filtered = filtered.filter(lead => 
          new Date(lead.created_at) >= startDate
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = (a.company || '').toLowerCase();
          bValue = (b.company || '').toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'lead_score':
          aValue = a.lead_score;
          bValue = b.lead_score;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [leads, searchTerm, filters, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, updated_at: new Date().toISOString() }
          : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      // Remove from local state
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hot': return 'text-red-400 bg-red-900/20';
      case 'warm': return 'text-yellow-400 bg-yellow-900/20';
      case 'cold': return 'text-blue-400 bg-blue-900/20';
      case 'solved':
      case 'won': return 'text-green-400 bg-green-900/20';
      case 'lost': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <p className="text-gray-400 text-sm">
              {filteredLeads.length} of {leads.length} leads
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Lead
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, company, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-700">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Solved">Solved</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>

              {/* Assigned To Filter */}
              <select
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>

              {/* Territory Filter */}
              <select
                value={filters.territory}
                onChange={(e) => setFilters(prev => ({ ...prev, territory: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Territories</option>
                {territories.map(territory => (
                  <option key={territory.id} value={territory.id}>{territory.name}</option>
                ))}
              </select>

              {/* Date Range Filter */}
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>

              {/* Min Value Filter */}
              <input
                type="number"
                placeholder="Min Value"
                value={filters.minValue}
                onChange={(e) => setFilters(prev => ({ ...prev, minValue: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />

              {/* Max Value Filter */}
              <input
                type="number"
                placeholder="Max Value"
                value={filters.maxValue}
                onChange={(e) => setFilters(prev => ({ ...prev, maxValue: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Leads Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Lead Details
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Status
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Value
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => handleSort('lead_score')}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Score
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-1">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center hover:text-white transition-colors"
                >
                  Created
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-800">
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Lead Details */}
                    <div className="col-span-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate">{lead.name}</p>
                          {lead.company && (
                            <p className="text-gray-400 text-sm truncate">{lead.company}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            {lead.email && (
                              <span className="text-gray-400 text-xs flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {lead.email}
                              </span>
                            )}
                            {lead.phone && (
                              <span className="text-gray-400 text-xs flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {lead.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(lead.status)}`}
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Solved">Solved</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>

                    {/* Value */}
                    <div className="col-span-2">
                      <span className="text-white font-medium">
                        {formatCurrency(lead.value)}
                      </span>
                    </div>

                    {/* Lead Score */}
                    <div className="col-span-1">
                      <div className="flex items-center">
                        <span className={`font-medium ${getLeadScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </span>
                        <div className="ml-2 w-12 bg-gray-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              lead.lead_score >= 80 ? 'bg-green-500' :
                              lead.lead_score >= 60 ? 'bg-yellow-500' :
                              lead.lead_score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${lead.lead_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="col-span-2">
                      {lead.assigned_user ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm truncate">
                            {lead.assigned_user.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Unassigned</span>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1">
                      <span className="text-gray-400 text-sm">
                        {formatDate(lead.created_at)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No leads found</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm || Object.values(filters).some(f => f) 
                    ? 'Try adjusting your search or filters'
                    : 'Add your first lead to get started'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLead(null);
          }}
          onUpdate={loadLeads}
        />
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadLeads}
        />
      )}
    </div>
  );
};
