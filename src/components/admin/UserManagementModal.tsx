// src/components/admin/UserManagementModal.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Users, UserPlus, Edit, Trash2, Search, Shield, Eye, EyeOff, Save } from 'lucide-react';

// Define the available roles
export const USER_ROLES = ['Admin', 'Director', 'Manager', 'Sales Rep'] as const;
export type UserRole = typeof USER_ROLES[number];

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Add user form
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'Sales Rep' as UserRole,
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
        role: 'Sales Rep' as UserRole,
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

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alert('User role updated successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    } finally {
      setIsLoading(false);
      setEditingUser(null);
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

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': 
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'Director': 
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Manager': 
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Sales Rep': 
        return 'bg-green-100 text-green-700 border border-green-200';
      default: 
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            User Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User List
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add New User
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50">
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
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading users...</p>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-900 font-medium">{user.name}</p>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2">
                            {editingUser?.id === user.id ? (
                              <select
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                                className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {USER_ROLES.map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            )}
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-600 text-sm">
                              {user.phone || 'Not provided'}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                user.is_active ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-600 text-sm">
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="col-span-1">
                            <div className="flex items-center space-x-1">
                              {editingUser?.id === user.id ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateUserRole(user.id, editingUser.role)}
                                    className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                    title="Save Role"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingUser(user)}
                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="Edit Role"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                    className="p-1 text-gray-500 hover:text-orange-600 transition-colors"
                                    title={user.is_active ? 'Deactivate User' : 'Activate User'}
                                  >
                                    {user.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg mb-2">No users found</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {USER_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newUser.state}
                    onChange={(e) => setNewUser(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="TX"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors disabled:opacity-50 shadow-sm"
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
