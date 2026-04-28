import { motion } from 'framer-motion';
import { Activity, Bell, Settings, User } from 'lucide-react';

const Navbar = () => {
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Dashboard', active: true },
              { name: 'Analytics', active: false },
              { name: 'Reports', active: false },
              { name: 'Settings', active: false }
            ].map((item) => (
              <motion.a
                key={item.name}
                href="#"
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  item.active
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full border-2 border-white"></span>
            </motion.button>

            {/* Settings */}
            <motion.button
              className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* User Profile */}
            <motion.button
              className="flex items-center space-x-2 p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">Dr. Smith</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;