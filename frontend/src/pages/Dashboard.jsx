import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Users, Activity } from 'lucide-react';
import { getHospitalStatus, getPrediction, getStoredUser } from '../services/api';
import MetricCard from '../components/MetricCard';
import AlertsPanel from '../components/AlertsPanel';
import PredictionForm from '../components/PredictionForm';
import PatientLoadChart from '../charts/PatientLoadChart';

const Dashboard = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [occupancy, setOccupancy] = useState(0);
  const navigate = useNavigate();
  const user = getStoredUser();
  const welcomeName = user?.username || user?.name || user?.email || 'CareNest User';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const status = await getHospitalStatus();
        setHospitalData(status);
        // Initialize occupancy
        const initialOccupancy = ((status?.current_patients ?? status?.patient_count ?? 0) / (status?.beds_available ?? 100) * 100).toFixed(2);
        setOccupancy(initialOccupancy);
      } catch (err) {
        setError('Unable to load hospital dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOccupancy = (predictedPatients) => {
    const totalBeds = hospitalData?.beds_available ?? 100;
    const newOccupancy = ((predictedPatients / totalBeds) * 100).toFixed(2);
    console.log(`Updating occupancy: ${predictedPatients} patients / ${totalBeds} beds = ${newOccupancy}%`);
    setOccupancy(newOccupancy);
  };

  const handlePrediction = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const payload = {
        current_patients: hospitalData?.current_patients ?? hospitalData?.patient_count ?? 134,
        patient_count: hospitalData?.patient_count ?? hospitalData?.current_patients ?? 134,
        icu_available: hospitalData?.icu_available ?? (hospitalData?.icu_usage ? 100 - hospitalData.icu_usage : 20),
        beds_available: hospitalData?.beds_available ?? 88,
        staff_available: hospitalData?.staff_available ?? hospitalData?.staff_count ?? 38,
        staff_count: hospitalData?.staff_count ?? hospitalData?.staff_available ?? 38,
        occupancy_rate: hospitalData?.occupancy_rate ?? 72,
      };

      console.log('Sending prediction payload:', payload);
      const result = await getPrediction(payload);
      console.log('Prediction Response:', result);

      setPrediction(result);

      // Update occupancy dynamically
      if (result?.predicted_patients) {
        updateOccupancy(result.predicted_patients);
      }

    } catch (err) {
      console.error('Prediction Error:', err);
      setError('Prediction service failed. Please check your backend connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMetricCardClick = (card) => {
    const cardName = card.title || 'metric';
    console.log(`Metric card clicked: ${cardName}`);
    navigate('/analytics');
  };

  const metricCards = useMemo(() => {
    const data = hospitalData || {
      patient_count: 132,
      beds_available: 74,
      icu_available: 22,
      staff_count: 45,
      occupancy_rate: 72,
    };

    return [
      {
        title: 'Current Patients',
        value: data.patient_count,
        subtitle: 'Active admissions in the hospital',
        icon: ShieldCheck,
        color: 'primary',
        trend: data.patient_count > 120 ? 'up' : 'down',
        trendValue: '+8%',
      },
      {
        title: 'Beds Available',
        value: data.beds_available,
        subtitle: 'Beds ready for new patients',
        icon: Activity,
        color: 'success',
        trend: 'down',
        trendValue: '-5%',
      },
      {
        title: 'ICU Beds Available',
        value: data.icu_available,
        subtitle: 'Remaining ICU capacity',
        icon: ShieldCheck,
        color: 'warning',
        trend: 'down',
        trendValue: '-12%',
      },
      {
        title: 'Staff Available',
        value: data.staff_count,
        subtitle: 'Nurses and doctors on duty',
        icon: Users,
        color: 'secondary',
        trend: 'up',
        trendValue: '+10%',
      },
      {
        title: 'Occupancy Rate',
        value: `${data.occupancy_rate}%`,
        subtitle: 'Hospital capacity utilization',
        icon: TrendingUp,
        color: 'danger',
        trend: 'up',
        trendValue: '+7%',
      },
    ];
  }, [hospitalData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Hospital command center
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Welcome back, {welcomeName}
              </h1>
              <p className="text-lg leading-8 text-slate-300">
                Monitor hospital operations, view predicted load, and stay ahead of alerts with a calm, responsive command center.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handlePrediction}
                disabled={analyzing || !hospitalData}
                className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              >
                {analyzing ? 'Analyzing...' : 'Run Prediction'}
              </button>
              <div className="rounded-full border border-white/10 bg-slate-950/80 px-6 py-3 text-center text-sm text-slate-300">
                Occupancy {occupancy}%
              </div>
            </div>
          </div>
        </header>

        <section id="hospital-status" className="mt-10 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25">
          {error && (
            <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Hospital Status Dashboard</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Current operational metrics</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              A clean summary of patient load, bed and ICU availability, staffing, and overall occupancy at a glance.
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">
              Loading hospital status...
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {metricCards.map((card, index) => (
                <MetricCard
                  key={card.title}
                  {...card}
                  delay={index * 0.05}
                  onClick={() => handleMetricCardClick(card)}
                />
              ))}
            </div>
          )}
        </section>

        <section id="prediction-panel" className="mt-10 grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/25">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Prediction Panel</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">6-hour patient load forecast</h2>
              </div>
              <span className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300">Live estimate</span>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <PatientLoadChart />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Forecast summary</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Risk & readiness</h3>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Predicted risk level</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{prediction?.risk_level?.toUpperCase() || 'PENDING'}</p>
                  <p className="mt-2 text-sm text-slate-500">Confidence {prediction?.confidence || '—'}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Top recommendations</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {(prediction?.recommendations || ['Awaiting forecast']).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <PredictionForm />
          </div>
        </section>

        <AlertsPanel />
      </div>
    </div>
  );
};

export default Dashboard;
