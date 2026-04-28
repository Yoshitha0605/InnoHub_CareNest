import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const AlertCard = ({ alert, onDismiss }) => {
  const getAlertConfig = (level) => {
    switch (level) {
      case 'critical':
      case 'high':
        return {
          icon: AlertTriangle,
          bg: 'bg-gradient-to-r from-danger-500 to-danger-600',
          lightBg: 'bg-danger-50',
          border: 'border-danger-200',
          text: 'text-danger-800',
          title: 'text-danger-900',
          description: 'Critical Alert'
        };
      case 'warning':
      case 'medium':
        return {
          icon: AlertTriangle,
          bg: 'bg-gradient-to-r from-warning-500 to-warning-600',
          lightBg: 'bg-warning-50',
          border: 'border-warning-200',
          text: 'text-warning-800',
          title: 'text-warning-900',
          description: 'Warning Alert'
        };
      case 'info':
      case 'low':
        return {
          icon: Info,
          bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
          lightBg: 'bg-secondary-50',
          border: 'border-secondary-200',
          text: 'text-secondary-800',
          title: 'text-secondary-900',
          description: 'Information'
        };
      default:
        return {
          icon: CheckCircle,
          bg: 'bg-gradient-to-r from-success-500 to-success-600',
          lightBg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-800',
          title: 'text-success-900',
          description: 'Status Normal'
        };
    }
  };

  const config = getAlertConfig(alert.level || alert.risk_level);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${config.lightBg} border ${config.border} p-4 shadow-lg`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
        <div className={`w-full h-full ${config.bg} rounded-full blur-lg`}></div>
      </div>

      <div className="relative z-10 flex items-start space-x-4">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg} shadow-md`}>
          <config.icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${config.title} uppercase tracking-wide`}>
              {alert.title || config.description}
            </h4>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-secondary-500" />
              </button>
            )}
          </div>
          <p className={`mt-1 text-sm ${config.text} leading-relaxed`}>
            {alert.message || alert.description}
          </p>
          {alert.timestamp && (
            <p className="mt-2 text-xs text-secondary-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${config.bg}`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default AlertCard;