// src/components/admin/UserManagementModal.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Users, UserPlus, Edit, Trash2, Search, Shield, Eye, EyeOff } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  state?: string;
  is_active: boolean;
  created_at: string;
  last_sign_in_at?: string;
}

interface UserManagementModalProps {
  onClose: () => void;
  onRefresh: () => void;
  defaultTab?: 'list' | 'add';
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  onClose,
  onRefresh,
  defaultTab = 'list'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Add user form
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'Sales Rep',
    phone: '',
    state: ''
  });

  useEffect(() => {
    if (activeTab === 'list') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password || !newUser.name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const organizationId = localStorage.getItem('organizationId');
      
      const userData = {
        id: crypto.randomUUID(),
        email: newUser.email.trim(),
        name: newUser.name.trim(),
        role: newUser.role,
        phone: newUser.phone.trim() || null,
        state: newUser.state.trim() || null,
        organization_id: organizationId,
        is_active: true,
        created_at: new Date().toISOString()
      };

      // In a real implementation, this would create the auth user and database record
      const { error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) throw error;

      // Reset form
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'Sales Rep',
        phone: '',
        state: ''
      });

      alert('User created successfully!');
      setActiveTab('list');
      onRefresh();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      await loadUsers();
      onRefresh();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      await loadUsers();
      onRefresh();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': 
      case 'HR': 
        return 'bg-red-900/20 text-red-400';
      case 'Sales Manager': 
        return 'bg-blue-900/20 text-blue-400';
      case 'Sales Rep': 
        return 'bg-green-900/20 text-green-400';
      default: 
        return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="h-6 w-6 mr-3 text-purple-500" />
            User Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            User List
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Add New User
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'list' ? (
            <div>
              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Users Table */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700 bg-gray-850">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-700">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-400">Loading users...</p>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-300 text-sm">
                              {user.phone || 'Not provided'}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-900/20 text-green-400'
                                : 'bg-red-900/20 text-red-400'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                user.is_active ? 'bg-green-400' : 'bg-red-400'
                              }`}></div>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-400 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="col-span-1">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                                title={user.is_active ? 'Deactivate User' : 'Activate User'}
                              >
                                {user.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">No users found</p>
                      <p className="text-gray-500 text-sm">
                        {searchTerm ? 'Try adjusting your search' : 'Add your first user to get started'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Add User Form */
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="user@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Sales Rep">Sales Rep</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newUser.state}
                    onChange={(e) => setNewUser(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="TX"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
