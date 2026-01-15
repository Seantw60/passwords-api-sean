import { useState } from 'react';
import { useAuth } from '../../App';
import { Users, Shield, Activity, TrendingUp } from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      joinDate: '2025-05-10',
      lastActive: '2 hours ago',
      postsCount: 24,
      commentsCount: 156,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      joinDate: '2025-06-15',
      lastActive: '1 hour ago',
      postsCount: 18,
      commentsCount: 203,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'editor',
      joinDate: '2025-07-20',
      lastActive: '3 hours ago',
      postsCount: 15,
      commentsCount: 127,
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'reader',
      joinDate: '2025-08-05',
      lastActive: '1 day ago',
      postsCount: 0,
      commentsCount: 89,
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'reader',
      joinDate: '2025-09-12',
      lastActive: '5 hours ago',
      postsCount: 0,
      commentsCount: 45,
    },
  ];

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(u => u.role === selectedRole);

  if (user?.role !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-white border-2 border-neutral-300 p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-neutral-600">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const rolePermissions = {
    admin: ['Create Posts', 'Edit All Posts', 'Delete All Posts', 'Manage Users', 'Moderate Comments', 'View Analytics'],
    editor: ['Create Posts', 'Edit Own Posts', 'Delete Own Posts', 'Moderate Comments'],
    reader: ['View Posts', 'Add Comments', 'Edit Own Comments'],
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Panel</h1>
        <p className="text-neutral-600">Manage users, roles, and view system metrics</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-2 border-neutral-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-neutral-400" />
            <div className="text-3xl font-bold">{users.length}</div>
          </div>
          <div className="text-sm text-neutral-600">Total Users</div>
        </div>
        <div className="bg-white border-2 border-neutral-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-neutral-400" />
            <div className="text-3xl font-bold">142</div>
          </div>
          <div className="text-sm text-neutral-600">Total Posts</div>
        </div>
        <div className="bg-white border-2 border-neutral-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-neutral-400" />
            <div className="text-3xl font-bold">1,234</div>
          </div>
          <div className="text-sm text-neutral-600">Total Comments</div>
        </div>
        <div className="bg-white border-2 border-neutral-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-neutral-400" />
            <div className="text-3xl font-bold">89%</div>
          </div>
          <div className="text-sm text-neutral-600">Active Users</div>
        </div>
      </div>

      {/* Role Permissions */}
      <div className="bg-white border-2 border-neutral-300 p-8 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5" />
          <h2 className="font-bold text-xl">Role Permissions</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="p-6 bg-neutral-50 border-2 border-neutral-300">
              <h3 className="font-bold uppercase mb-4 text-lg">{role}</h3>
              <ul className="space-y-2">
                {permissions.map((permission, i) => (
                  <li key={i} className="text-sm text-neutral-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white border-2 border-neutral-300 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl">User Management</h2>
          <div className="flex gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="reader">Reader</option>
            </select>
            <button className="px-6 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-700">
              Add New User
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-300 bg-neutral-50">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Join Date</th>
                <th className="px-4 py-3 text-left font-medium">Last Active</th>
                <th className="px-4 py-3 text-left font-medium">Posts</th>
                <th className="px-4 py-3 text-left font-medium">Comments</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="border-b-2 border-neutral-200 last:border-b-0 hover:bg-neutral-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-400"></div>
                      <div>
                        <div className="font-medium">{userData.name}</div>
                        <div className="text-sm text-neutral-600">{userData.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 text-xs font-medium uppercase ${
                      userData.role === 'admin' 
                        ? 'bg-neutral-900 text-white' 
                        : userData.role === 'editor'
                        ? 'bg-neutral-600 text-white'
                        : 'bg-neutral-300 text-neutral-800'
                    }`}>
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{userData.joinDate}</td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{userData.lastActive}</td>
                  <td className="px-4 py-4 text-center">{userData.postsCount}</td>
                  <td className="px-4 py-4 text-center">{userData.commentsCount}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border-2 border-neutral-300 text-sm hover:bg-neutral-50">
                        Edit
                      </button>
                      <button className="px-3 py-1 border-2 border-neutral-300 text-sm hover:bg-red-50 text-red-600">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="mt-8 bg-white border-2 border-neutral-300 p-8">
        <h2 className="font-bold text-xl mb-6">Engagement Metrics (Read-Only)</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
            <h3 className="font-medium mb-4">Post Activity (Last 30 Days)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Posts Published</span>
                <span className="font-bold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Average Views</span>
                <span className="font-bold">324</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Average Comments</span>
                <span className="font-bold">12</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
            <h3 className="font-medium mb-4">User Activity (Last 30 Days)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Daily Active Users</span>
                <span className="font-bold">67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">New Users</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Engagement Rate</span>
                <span className="font-bold">76%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
