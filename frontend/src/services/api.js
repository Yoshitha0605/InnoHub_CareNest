import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8003',
  timeout: 30000,  // Increased timeout for AI predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('care-nest-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user) => {
  localStorage.setItem('care-nest-user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem('care-nest-user');
};

export const login = async (payload) => {
  const response = await api.post('/login', payload);
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await api.post('/settings', payload);
  return response.data;
};

export const generateReport = async (reportType = 'summary') => {
  try {
    const response = await api.get(`/generate-report?report_type=${encodeURIComponent(reportType)}`);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      report_type: reportType,
      generated_at: new Date().toISOString(),
      hospital_name: 'Metro General Hospital',
      hospital_region: 'Central City',
      summary: {
        current_patients: 145,
        beds_available: 85,
        icu_available: 22,
        occupancy_rate: 72,
        alert_level: 'YELLOW',
      },
    };
  }
};

export const downloadReport = (reportData, filename = 'hospital-report.json') => {
  const dataStr = JSON.stringify(reportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getHospitalStatus = async () => {
  try {
    const response = await api.get('/hospital-status');
    const data = response.data;
    return {
      hospital_name: data.hospital_name || 'CareNest Hospital',
      patient_count: data.current_patients ?? data.patient_count ?? 0,
      beds_available: data.beds_available,
      icu_available: data.icu_available ?? data.icu_usage ?? 0,
      staff_count: data.staff_count ?? data.staff_available ?? 0,
      occupancy_rate: data.occupancy_rate ?? 0,
      ...data,
    };
  } catch (error) {
    console.error('Error fetching hospital status:', error);
    // Return dummy data for demo
    return {
      hospital_name: 'CareNest Hospital',
      patient_count: 145,
      icu_available: 22,
      beds_available: 85,
      staff_count: 42,
      occupancy_rate: 72,
    };
  }
};

export const getPrediction = async (data) => {
  try {
    const payload = {
      current_patients: Number((data.current_patients ?? data.patient_count) || 0),
      patient_count: Number((data.patient_count ?? data.current_patients) || 0),
      beds_available: Number(data.beds_available || 0),
      icu_available: Number(data.icu_available || 0),
      staff_available: Number((data.staff_available ?? data.staff_count) || 0),
      staff_count: Number((data.staff_count ?? data.staff_available) || 0),
      occupancy_rate: Number(data.occupancy_rate || 0),
    };

    const response = await api.post('/predict', payload);
    const result = response.data;

    const formattedConfidence =
      typeof result.confidence === 'number'
        ? `${Math.round(result.confidence * 100)}%`
        : result.confidence || '80%';

    return {
      predicted_patients: result.predicted_patients ?? result.predicted_patients_next_6hrs,
      predicted_patients_next_6hrs: result.predicted_patients_next_6hrs ?? result.predicted_patients,
      risk_level: result.risk_level || result.surge_risk || 'Low',
      surge_risk: result.surge_risk || result.risk_level || 'Low',
      confidence: formattedConfidence,
      recommendations: result.recommendations || [result.recommended_action || 'Monitor capacity'],
      recommended_action: result.recommended_action || result.recommendations?.[0] || 'Monitor capacity',
    };
  } catch (error) {
    console.error('Error getting prediction:', error);
    const riskLevel = data.patient_count > 130 ? 'High' : data.patient_count > 110 ? 'Medium' : 'Low';
    return {
      predicted_patients: data.patient_count > 130 ? data.patient_count + 30 : data.patient_count > 100 ? data.patient_count + 20 : data.patient_count + 10,
      predicted_patients_next_6hrs: data.patient_count > 130 ? data.patient_count + 30 : data.patient_count > 100 ? data.patient_count + 20 : data.patient_count + 10,
      risk_level: riskLevel,
      surge_risk: riskLevel,
      confidence: '80%',
      recommendations: [
        'Increase ICU capacity by 20%',
        'Call in additional nursing staff',
        'Prepare emergency protocols',
      ],
      recommended_action: 'Increase capacity and staff readiness',
    };
  }
};

export const getAlerts = async () => {
  try {
    const response = await api.get('/alerts');
    const alert = response.data;
    return {
      title:
        alert.alert_level === 'RED'
          ? 'Critical Alert'
          : alert.alert_level === 'YELLOW'
          ? 'Warning Alert'
          : 'Status OK',
      message: alert.message,
      level: (alert.alert_level || '').toLowerCase(),
      patient_count: alert.patient_count,
      beds_available: alert.beds_available,
      icu_available: alert.icu_available,
      occupancy_rate: alert.occupancy_rate,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching alerts:', error);
    // Return dummy alert
    return {
      title: 'High Patient Load Alert',
      message: 'Current patient count exceeds 70% capacity. Prepare for surge.',
      level: 'high',
      timestamp: new Date().toISOString(),
    };
  }
};