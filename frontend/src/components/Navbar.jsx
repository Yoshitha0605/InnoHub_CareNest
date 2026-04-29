import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bell, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('User');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('care-nest-user');
      if (raw) {
        const stored = JSON.parse(raw);
        setDisplayName(stored.username || stored.role || 'CareNest User');
      }
    } catch {
      // ignore invalid stored user
    }
  }, []);

  const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('care-nest-user');
    navigate('/login');
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  CareNest
                </h1>
                <p className="text-xs text-secondary-600 font-medium">Predict. Prepare. Prevent.</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
              return (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50 shadow-sm'
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={handleNotificationClick}
                className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full border-2 border-white"></span>
              </motion.button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl z-50">
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <p className="mt-2 text-sm text-slate-600">You have new updates from hospital monitoring and predictions.</p>
                  </div>
                  <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                    3 alerts waiting - click to review in the dashboard.
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <motion.button
              onClick={() => navigate('/settings')}
              className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(prev => !prev)} // Reuse showNotifications for user menu
                className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{displayName}</span>
              </motion.button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl z-50">
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-600">CareNest User</p>
                  </div>
                  <div className="border-t border-slate-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-b-2xl"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;