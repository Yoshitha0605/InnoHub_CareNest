import { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import AlertCard from './AlertCard';

const AlertsPanel = ({ theme }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAlerts();
        setAlerts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Unable to load alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className={`rounded-[2rem] border p-6 shadow-2xl ${
      theme === 'dark'
        ? 'border-white/10 bg-slate-900/90 shadow-slate-950/25'
        : 'border-slate-200 bg-white/90 shadow-slate-200/25'
    }`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-sm uppercase tracking-[0.35em] ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
          }`}>Alerts Panel</p>
          <h2 className={`mt-3 text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>System alerts</h2>
        </div>
        <span className={`inline-flex rounded-full px-4 py-2 text-sm ${
          theme === 'dark'
            ? 'bg-slate-950/80 text-slate-300'
            : 'bg-slate-100/80 text-slate-700'
        }`}>
          Live monitoring
        </span>
      </div>

      {loading ? (
        <div className={`rounded-3xl border p-6 text-center ${
          theme === 'dark'
            ? 'border-slate-800 bg-slate-950/80 text-slate-400'
            : 'border-slate-300 bg-slate-100/80 text-slate-600'
        }`}>
          Loading alerts...
        </div>
      ) : error ? (
        <div className={`rounded-3xl border p-6 text-sm ${
          theme === 'dark'
            ? 'border-red-500/20 bg-red-500/10 text-red-100'
            : 'border-red-500/20 bg-red-500/10 text-red-800'
        }`}>
          {error}
        </div>
      ) : alerts.length === 0 ? (
        <div className={`rounded-3xl border p-6 text-center ${
          theme === 'dark'
            ? 'border-slate-800 bg-slate-950/80 text-slate-400'
            : 'border-slate-300 bg-slate-100/80 text-slate-600'
        }`}>
          No active alerts. Systems are stable.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
