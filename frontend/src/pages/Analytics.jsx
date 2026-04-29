import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, TrendingUp, Activity, Users, ArrowUp, ArrowDown } from 'lucide-react';

const Analytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('patients');
  const [timeRange, setTimeRange] = useState('week');

  const analyticsCards = [
    {
      title: 'Patient Trends',
      description: 'Historical patient admission patterns',
      icon: TrendingUp,
      color: 'from-primary-500 to-primary-600',
      key: 'patients',
      value: '145',
      change: '+8%',
      isUp: true,
    },
    {
      title: 'Resource Usage',
      description: 'Bed and ICU utilization analytics',
      icon: Activity,
      color: 'from-success-500 to-success-600',
      key: 'resources',
      value: '72%',
      change: '+5%',
      isUp: true,
    },
    {
      title: 'Staff Performance',
      description: 'Nurse and doctor efficiency metrics',
      icon: Users,
      color: 'from-warning-500 to-warning-600',
      key: 'staff',
      value: '42',
      change: '-2%',
      isUp: false,
    },
    {
      title: 'Operational Efficiency',
      description: 'Overall department performance',
      icon: BarChart3,
      color: 'from-accent-500 to-accent-600',
      key: 'efficiency',
      value: '85%',
      change: '+12%',
      isUp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.header
          className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Advanced analytics
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Hospital Analytics
              </h1>
              <p className="text-lg leading-8 text-slate-300">
                Deep insights into patient flow, resource utilization, and operational efficiency with interactive charts and predictive analytics.
              </p>
            </div>
            <div className="rounded-full bg-slate-950/80 px-4 py-3 text-center text-sm text-slate-300">
              Coming Soon
            </div>
          </div>
        </motion.header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {analyticsCards.map((item, index) => (
            <motion.div
              key={item.key}
              onClick={() => setSelectedMetric(item.key)}
              className={`rounded-[2rem] border transition-all cursor-pointer p-6 shadow-2xl shadow-slate-950/25 ${
                selectedMetric === item.key
                  ? 'bg-slate-900 border-primary-500 ring-2 ring-primary-500'
                  : 'bg-slate-900/90 border-white/10 hover:border-white/20'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{item.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{item.value}</span>
                <span className={`flex items-center text-sm ${item.isUp ? 'text-success-400' : 'text-danger-400'}`}>
                  {item.isUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {item.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 grid gap-8 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25">
            <h2 className="text-2xl font-semibold text-white mb-6">Trends Analysis</h2>
            <div className="space-y-4">
              {['Peak Hours', 'Average Admission', 'Discharge Rate', 'Readmission Rate'].map((label, idx) => (
                <div key={label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-white font-medium">{75 + idx * 5}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${75 + idx * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25">
              <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/80 rounded-xl">
                  <p className="text-sm text-slate-400">Average Wait Time</p>
                  <p className="text-lg font-bold text-white mt-1">24 mins</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl">
                  <p className="text-sm text-slate-400">Patient Satisfaction</p>
                  <p className="text-lg font-bold text-white mt-1">4.8/5.0</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl">
                  <p className="text-sm text-slate-400">Treatment Success Rate</p>
                  <p className="text-lg font-bold text-white mt-1">94.2%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition">
                  Export Report
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition">
                  Customize Dashboard
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;