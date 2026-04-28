import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  delay = 0
}) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
        lightBg: 'bg-primary-50',
        text: 'text-primary-600',
        border: 'border-primary-200'
      },
      success: {
        bg: 'bg-gradient-to-br from-success-500 to-success-600',
        lightBg: 'bg-success-50',
        text: 'text-success-600',
        border: 'border-success-200'
      },
      warning: {
        bg: 'bg-gradient-to-br from-warning-500 to-warning-600',
        lightBg: 'bg-warning-50',
        text: 'text-warning-600',
        border: 'border-warning-200'
      },
      danger: {
        bg: 'bg-gradient-to-br from-danger-500 to-danger-600',
        lightBg: 'bg-danger-50',
        text: 'text-danger-600',
        border: 'border-danger-200'
      },
      secondary: {
        bg: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
        lightBg: 'bg-secondary-50',
        text: 'text-secondary-600',
        border: 'border-secondary-200'
      }
    };
    return colors[color] || colors.primary;
  };

  const colors = getColorClasses(color);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-danger-600';
      default:
        return 'text-secondary-600';
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${colors.lightBg} border ${colors.border} p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -2 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <div className={`w-full h-full ${colors.bg} rounded-full blur-xl`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-3xl font-bold text-secondary-900 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <p className="text-sm font-medium text-secondary-700 mb-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-secondary-500">{subtitle}</p>
          )}
        </div>

        {/* Progress Bar for percentage values */}
        {title.includes('%') && (
          <div className="mt-4">
            <div className="w-full bg-white/50 rounded-full h-2">
              <motion.div
                className={`h-2 ${colors.bg} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(parseInt(value), 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;