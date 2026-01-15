import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { Menu, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['admin', 'editor', 'reader'] },
    { path: '/posts', label: 'Blog Posts', roles: ['admin', 'editor', 'reader'] },
    { path: '/posts/create', label: 'Create Post', roles: ['admin', 'editor'] },
    { path: '/wellness', label: 'Wellness Check-In', roles: ['admin', 'editor', 'reader'] },
    { path: '/admin', label: 'Admin Panel', roles: ['admin'] },
  ];

  const canAccess = (roles) => {
    return user && roles.includes(user.role);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b-2 border-neutral-300 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900"></div>
              <span className="font-bold text-lg">Blog App</span>
            </Link>
          </div>

          {/* Global Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, comments, users..."
                className="w-full pl-10 pr-4 py-2 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </form>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-50"
            >
              <div className="w-8 h-8 bg-neutral-400"></div>
              <div className="text-left">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-neutral-500 uppercase">{user?.role}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-neutral-300 shadow-lg">
                <div className="p-4 border-b-2 border-neutral-200">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-neutral-600">{user?.email}</div>
                  <div className="text-xs text-neutral-500 uppercase mt-1">Role: {user?.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-neutral-100 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside
          className={`bg-white border-r-2 border-neutral-300 transition-all ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) =>
                canAccess(item.roles) ? (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 border-2 transition-colors ${
                        location.pathname === item.path
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {sidebarCollapsed ? (
                        <div className="w-full text-center">{item.label[0]}</div>
                      ) : (
                        item.label
                      )}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t-2 border-neutral-200">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full px-4 py-2 border-2 border-neutral-300 hover:bg-neutral-100 flex items-center justify-center"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
