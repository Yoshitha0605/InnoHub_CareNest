import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Users } from 'lucide-react';

const Analytics = () => {
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
            <div className="rounded-full bg-slate-950/80 px-6 py-3 text-center text-sm text-slate-300">
              Coming Soon
            </div>
          </div>
        </motion.header>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Patient Trends',
              description: 'Historical patient admission patterns',
              icon: TrendingUp,
              color: 'from-primary-500 to-primary-600',
            },
            {
              title: 'Resource Usage',
              description: 'Bed and ICU utilization analytics',
              icon: Activity,
              color: 'from-success-500 to-success-600',
            },
            {
              title: 'Staff Performance',
              description: 'Nurse and doctor efficiency metrics',
              icon: Users,
              color: 'from-warning-500 to-warning-600',
            },
            {
              title: 'Predictive Models',
              description: 'AI-driven forecasting insights',
              icon: BarChart3,
              color: 'from-accent-500 to-accent-600',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-4">Advanced Analytics Coming Soon</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            This section will feature interactive charts, real-time dashboards, predictive modeling, and comprehensive healthcare analytics to help you make data-driven decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;