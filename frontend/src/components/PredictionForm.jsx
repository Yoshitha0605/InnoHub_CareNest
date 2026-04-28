import { useState } from 'react';
import { getPrediction } from '../services/api';

const formatRisk = (risk) => {
  if (!risk) return 'Pending';
  const normalized = risk.toString().trim().toUpperCase();
  if (normalized === 'HIGH') return 'High';
  if (normalized === 'MEDIUM' || normalized === 'YELLOW') return 'Medium';
  return 'Low';
};

const PredictionForm = () => {
  const [form, setForm] = useState({
    patient_count: 90,
    beds_available: 100,
    icu_available: 20,
    staff_count: 50,
    occupancy_rate: 90,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        patient_count: Number(form.patient_count),
        beds_available: Number(form.beds_available),
        icu_available: Number(form.icu_available),
        staff_count: Number(form.staff_count),
        occupancy_rate: Number(form.occupancy_rate),
      };
      const prediction = await getPrediction(payload);

      // Add mock confidence score since backend doesn't provide it
      const mockConfidence = Math.round((0.75 + Math.random() * 0.2) * 100) / 100; // 0.75-0.95

      setResult({
        ...prediction,
        confidence: mockConfidence,
        risk_level: prediction.surge_risk, // Map surge_risk to risk_level for consistency
      });
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Prediction request failed. Please check your backend connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/25">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Predictive input</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Hospital data simulator</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-300">
          Current patients
          <input
            name="patient_count"
            type="number"
            value={form.patient_count}
            onChange={handleChange}
            min="0"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Beds available
          <input
            name="beds_available"
            type="number"
            value={form.beds_available}
            onChange={handleChange}
            min="0"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          ICU available
          <input
            name="icu_available"
            type="number"
            value={form.icu_available}
            onChange={handleChange}
            min="0"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          Staff available
          <input
            name="staff_count"
            type="number"
            value={form.staff_count}
            onChange={handleChange}
            min="0"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          Occupancy rate (%)
          <input
            name="occupancy_rate"
            type="number"
            value={form.occupancy_rate}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-primary-400"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Predicting…' : 'Run prediction'}
        </button>
      </form>

      {error && (
        <div className="mt-5 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-slate-950/20 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-400">
            Analyzing hospital data with AI model...
          </p>
          <p className="text-sm text-blue-500 dark:text-blue-500 mt-2">
            This may take a few moments
          </p>
        </motion.div>
      )}

      {result && (
        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-slate-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Prediction result</p>
              <h4 className="mt-3 text-2xl font-semibold text-white">Predicted patients</h4>
            </div>
            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200">
              {formatRisk(result.surge_risk)} risk
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/95 p-5">
              <p className="text-sm text-slate-400">Next 6 hours</p>
              <p className="mt-3 text-4xl font-semibold text-white">{result.predicted_patients_next_6hrs}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/95 p-5">
              <p className="text-sm text-slate-400">Risk assessment</p>
              <p className="mt-3 text-4xl font-semibold text-white">{formatRisk(result.surge_risk)}</p>
            </div>
          </div>

          {result.recommended_action && (
            <div className="mt-5 rounded-3xl bg-slate-900/95 p-5 text-sm text-slate-300">
              <p className="text-slate-400">Recommended action</p>
              <p className="mt-2">{result.recommended_action}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
