import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { RoleGuard } from '../RoleGuard';
import { apiService } from '../../services/api';
import type { BackendUser, UserRole } from '../../types/auth';

const UserManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllUsers(page, 10) as {
        users: BackendUser[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
      setUsers(response.users);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: UserRole) => {
    try {
      await apiService.updateUserRole(userId.toString(), newRole);
      await fetchUsers(currentPage); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      if (isActive) {
        await apiService.deactivateUser(userId.toString());
      } else {
        await apiService.activateUser(userId.toString());
      }
      await fetchUsers(currentPage); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles: UserRole[] = ['admin', 'moderator', 'mentor', 'influencer', 'guide', 'enthusiast', 'learner'];

  return (
    <RoleGuard minimumRole="moderator" fallback={
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Access Denied</h3>
        <p className="text-red-600">You need moderator or admin privileges to view user management.</p>
      </div>
    }>
      <div className="p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">
            Manage users and their roles. Current user: {userProfile?.displayName} ({userProfile?.role})
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => fetchUsers(currentPage)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading && users.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className={!user.is_active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.display_name || `${user.first_name} ${user.last_name}`.trim() || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleGuard allowedRoles={['admin']} fallback={
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'mentor' ? 'bg-green-100 text-green-800' :
                                user.role === 'influencer' ? 'bg-yellow-100 text-yellow-800' :
                                  user.role === 'guide' ? 'bg-indigo-100 text-indigo-800' :
                                    user.role === 'enthusiast' ? 'bg-pink-100 text-pink-800' :
                                      'bg-gray-100 text-gray-800'
                          }`}>
                          {user.role}
                        </span>
                      }>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          disabled={user.firebase_uid === userProfile?.uid} // Can't change own role
                          aria-label={`Change role for ${user.email}`}
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </RoleGuard>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <RoleGuard allowedRoles={['admin']} fallback={<span className="text-gray-400">No actions</span>}>
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          disabled={user.firebase_uid === userProfile?.uid} // Can't deactivate own account
                          className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            } disabled:text-gray-400 disabled:cursor-not-allowed`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </RoleGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default UserManagement;
