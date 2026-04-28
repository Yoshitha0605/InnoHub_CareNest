import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const PatientLoadChart = ({ data, title = "Patient Load Forecast" }) => {
  const chartData = data || [
    { time: '00:00', patients: 45, predicted: 52 },
    { time: '04:00', patients: 38, predicted: 45 },
    { time: '08:00', patients: 72, predicted: 78 },
    { time: '12:00', patients: 95, predicted: 102 },
    { time: '16:00', patients: 118, predicted: 125 },
    { time: '20:00', patients: 89, predicted: 95 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-primary-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-secondary-900">{`Time: ${label}`}</p>
          <p className="text-sm text-primary-600">
            {`Current: ${payload[0].value} patients`}
          </p>
          {payload[1] && (
            <p className="text-sm text-accent-600">
              {`Predicted: ${payload[1].value} patients`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            {title}
          </h3>
          <p className="text-sm text-secondary-600 mt-1">6-hour patient load prediction</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full">
          <Clock className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">Live</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#currentGradient)"
              name="Current"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#d946ef"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }}
              name="Predicted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          <span className="text-sm text-secondary-600">Current Load</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent-500 rounded-full border-2 border-dashed border-accent-500"></div>
          <span className="text-sm text-secondary-600">Predicted Load</span>
        </div>
      </div>

      {/* Alert Indicator */}
      {chartData.some(d => d.predicted > 100) && (
        <motion.div
          className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AlertTriangle className="w-4 h-4 text-warning-600" />
          <span className="text-sm text-warning-800 font-medium">
            High load predicted in next 2 hours
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PatientLoadChart;