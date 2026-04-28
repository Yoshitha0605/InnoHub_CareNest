import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

const RecommendationCard = ({ recommendation, index, onAction }) => {
  const priorityColors = {
    high: {
      bg: 'bg-gradient-to-r from-danger-500 to-danger-600',
      lightBg: 'bg-danger-50',
      border: 'border-danger-200',
      text: 'text-danger-800',
      button: 'bg-danger-500 hover:bg-danger-600'
    },
    medium: {
      bg: 'bg-gradient-to-r from-warning-500 to-warning-600',
      lightBg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-800',
      button: 'bg-warning-500 hover:bg-warning-600'
    },
    low: {
      bg: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      lightBg: 'bg-secondary-50',
      border: 'border-secondary-200',
      text: 'text-secondary-800',
      button: 'bg-secondary-500 hover:bg-secondary-600'
    }
  };

  const priority = recommendation.priority || 'medium';
  const colors = priorityColors[priority];

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${colors.lightBg} border ${colors.border} p-5 shadow-md hover:shadow-lg transition-all duration-300`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Priority Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${colors.bg}`}>
          {priority.toUpperCase()}
        </div>
      </div>

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-10 h-10 ${colors.bg} rounded-lg mb-3 shadow-md`}>
        <Lightbulb className="w-5 h-5 text-white" />
      </div>

      {/* Content */}
      <h4 className={`font-semibold ${colors.text} mb-2 leading-tight`}>
        {recommendation.title || recommendation}
      </h4>

      {recommendation.description && (
        <p className="text-sm text-secondary-600 mb-4 leading-relaxed">
          {recommendation.description}
        </p>
      )}

      {/* Action Button */}
      {onAction && (
        <motion.button
          className={`inline-flex items-center gap-2 px-4 py-2 ${colors.button} text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAction(recommendation)}
        >
          <span>Implement</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Status Indicator */}
      {recommendation.status === 'completed' && (
        <div className="flex items-center gap-2 mt-3 text-success-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Completed</span>
        </div>
      )}

      {/* Animated Border */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${colors.bg}`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
      />
    </motion.div>
  );
};

export default RecommendationCard;