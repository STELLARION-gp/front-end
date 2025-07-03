import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard, AdminOnly, ManagerOrAdmin } from '../components/RoleGuard';
import UserManagement from '../components/admin/UserManagement';
import ConnectionStatus from '../components/ConnectionStatus';
import { hasPermission } from '../types/auth';

const TestDashboard: React.FC = () => {
  const { userProfile, logout } = useAuth();

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userProfile.displayName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectionStatus />
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${userProfile.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    userProfile.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                      userProfile.role === 'mentor' ? 'bg-green-100 text-green-800' :
                        userProfile.role === 'influencer' ? 'bg-yellow-100 text-yellow-800' :
                          userProfile.role === 'guide' ? 'bg-indigo-100 text-indigo-800' :
                            userProfile.role === 'enthusiast' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                  }`}>
                  {userProfile.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <p className="mt-1 text-sm text-gray-900">{userProfile.displayName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{userProfile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{userProfile.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className={`mt-1 text-sm ${userProfile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {userProfile.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">{userProfile.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Login</label>
                <p className="mt-1 text-sm text-gray-900">
                  {userProfile.lastLogin ? userProfile.lastLogin.toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions Display */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Your Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { key: 'canLearn' as const, label: 'Learn' },
                { key: 'canParticipate' as const, label: 'Participate' },
                { key: 'canGuide' as const, label: 'Guide Users' },
                { key: 'canInfluence' as const, label: 'Create Content' },
                { key: 'canMentor' as const, label: 'Mentor' },
                { key: 'canModerateContent' as const, label: 'Moderate' },
                { key: 'canViewAllUsers' as const, label: 'View Users' },
                { key: 'canManageUsers' as const, label: 'Manage Users' },
              ].map((permission) => (
                <div key={permission.key} className={`px-3 py-2 rounded-lg text-sm ${hasPermission(userProfile.role, permission.key)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                  {permission.label}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Panel */}
          <AdminOnly>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-purple-600">👑 Admin Panel</h3>
                <p className="text-gray-600 text-sm">Full system administration access</p>
              </div>
              <UserManagement />
            </div>
          </AdminOnly>

          {/* Manager Panel */}
          <ManagerOrAdmin fallback={null}>
            <RoleGuard allowedRoles={['moderator']} fallback={null}>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">🛡️ Moderator Panel</h3>
                <p className="text-gray-600 mb-4">Content moderation and user management tools</p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Reported Content
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Manage Community Guidelines
                  </button>
                </div>
              </div>
            </RoleGuard>
          </ManagerOrAdmin>
        </div>
      </main>
    </div>
  );
};

export default TestDashboard;
