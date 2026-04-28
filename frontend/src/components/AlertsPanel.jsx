import { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import AlertCard from './AlertCard';

const AlertsPanel = () => {
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
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Alerts Panel</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">System alerts</h2>
        </div>
        <span className="inline-flex rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
          Live monitoring
        </span>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-center text-slate-400">
          Loading alerts...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-100">
          {error}
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-center text-slate-400">
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
