import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Home, Activity } from 'lucide-react';
import { getAlerts, getHospitalStatus, getPrediction } from '../services/api';
import MetricCard from '../components/MetricCard';
import AlertCard from '../components/AlertCard';
import RecommendationCard from '../components/RecommendationCard';
import PatientLoadChart from '../charts/PatientLoadChart';

const Dashboard = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [alertData, setAlertData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [status, alerts] = await Promise.all([getHospitalStatus(), getAlerts()]);
        setHospitalData(status);
        setAlertData(Array.isArray(alerts) ? alerts : [alerts]);
      } catch (err) {
        setError('Unable to load hospital dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const payload = {
        patient_count: hospitalData?.patient_count ?? 134,
        icu_usage: hospitalData?.icu_usage ?? 74,
        beds_available: hospitalData?.beds_available ?? 88,
        staff_count: hospitalData?.staff_count ?? 38,
      };
      const result = await getPrediction(payload);
      setPrediction(result);
    } catch (err) {
      setError('Prediction service failed. Please check your backend connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const metricCards = useMemo(() => {
    const data = hospitalData || {
      patient_count: 132,
      beds_available: 74,
      icu_usage: 68,
      staff_count: 45,
      occupancy_rate: 72,
    };

    return [
      {
        title: 'Current Patients',
        value: data.patient_count,
        subtitle: 'Active admissions in the hospital',
        icon: Home,
        color: 'primary',
        trend: data.patient_count > 120 ? 'up' : 'down',
        trendValue: '+8%'
      },
      {
        title: 'Beds Available',
        value: data.beds_available,
        subtitle: 'Beds ready for new patients',
        icon: Activity,
        color: 'success',
        trend: 'down',
        trendValue: '-5%'
      },
      {
        title: 'ICU Beds Available',
        value: `${100 - data.icu_usage}%`,
        subtitle: 'Remaining ICU capacity',
        icon: ShieldCheck,
        color: 'warning',
        trend: 'down',
        trendValue: '-12%'
      },
      {
        title: 'Staff Available',
        value: data.staff_count,
        subtitle: 'Nurses and doctors on duty',
        icon: Users,
        color: 'secondary',
        trend: 'up',
        trendValue: '+10%'
      },
      {
        title: 'Occupancy Rate',
        value: `${data.occupancy_rate}%`,
        subtitle: 'Hospital capacity utilization',
        icon: TrendingUp,
        color: 'danger',
        trend: 'up',
        trendValue: '+7%'
      }
    ];
  }, [hospitalData]);

  const recommendationItems = [
    {
      title: 'Prepare ICU overflow tents',
      description: 'Set up temporary ICU wards near emergency rooms to support incoming critical patients.',
      priority: 'high'
    },
    {
      title: 'Schedule add-on nursing shifts',
      description: 'Bring additional staff on duty for the next surge window to maintain patient care quality.',
      priority: 'medium'
    },
    {
      title: 'Optimize bed turnover',
      description: 'Accelerate discharge planning for stable patients to free up beds faster.',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden bg-slate-900/90 py-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_25%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(15,23,42,1))]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 shadow-xl backdrop-blur-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 animate-pulse" />
                Live AI healthcare intelligence
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                CareNest — AI hospital command center
              </h1>
              <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                Predict patient surges, optimize bed and ICU capacity, and empower emergency teams with a stunning healthcare dashboard built for fast, data-driven decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-primary-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {analyzing ? 'Analyzing Load...' : 'Analyze Current Load'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                  View AI Forecast
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
              <div className="flex items-center justify-between rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5">
                <div>
                  <p className="text-sm text-slate-400">Hospital Health Index</p>
                  <p className="mt-2 text-3xl font-semibold text-white">87%</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 p-4 shadow-xl">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/90 p-5 text-slate-200 shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Next Surge</p>
                  <p className="mt-4 text-3xl font-semibold">+19%</p>
                  <p className="mt-2 text-sm text-slate-400">Expected within 4 hours</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5 text-slate-200 shadow-lg shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Response Readiness</p>
                  <p className="mt-4 text-3xl font-semibold">94%</p>
                  <p className="mt-2 text-sm text-slate-400">Staff and resources aligned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {metricCards.map((card) => (
                <MetricCard key={card.title} {...card} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.6fr_0.4fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">AI Prediction</p>
                    <h2 className="mt-3 text-2xl font-bold text-white">6-hour load forecast</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 px-4 py-2 text-sm text-slate-100">Stable Ops</div>
                </div>
                <div className="mt-6">
                  <PatientLoadChart />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Alert Panel</p>
                      <h2 className="mt-3 text-2xl font-bold text-white">System Status</h2>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white">Realtime</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {alertData.length > 0 ? (
                      alertData.map((alert, index) => (
                        <AlertCard key={index} alert={alert} />
                      ))
                    ) : (
                      <p className="rounded-3xl bg-slate-950/80 p-4 text-slate-400">No active alerts. Systems functioning normally.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Action Center</p>
                      <h2 className="mt-3 text-2xl font-bold text-white">Optimize resources</h2>
                    </div>
                    <div className="rounded-full bg-success-500 px-3 py-1 text-sm font-semibold text-white">AI-Driven</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {recommendationItems.map((item, index) => (
                      <RecommendationCard key={index} recommendation={item} index={index} onAction={() => null} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Load Analysis</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">AI Recommendation</h2>
                </div>
                <div className="rounded-3xl bg-gradient-to-r from-accent-500 to-primary-500 px-4 py-2 text-sm font-semibold text-white">Insights</div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Risk Level</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{prediction?.risk_level?.toUpperCase() || 'IMMEDIATE'}</p>
                  <p className="mt-2 text-sm text-slate-500">Predicted surge intensity based on current patient flow.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Recommendation Summary</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {(prediction?.recommendations || ['Increase staff rotation', 'Redistribute beds to critical units']).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center gap-3 text-sm text-secondary-400">
                <Activity className="w-5 h-5 text-primary-400" />
                <span>Operational Insights</span>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Next action</p>
                  <p className="mt-2 text-lg font-semibold text-white">Standby emergency reserves</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Performance</p>
                  <p className="mt-2 text-lg font-semibold text-white">Latency stable</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;