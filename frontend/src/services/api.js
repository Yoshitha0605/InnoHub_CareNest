import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8001',
  timeout: 30000,  // Increased timeout for AI predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHospitalStatus = async () => {
  try {
    const response = await api.get('/hospital-status');
    return {
      ...response.data,
      icu_available: response.data.icu_available ?? response.data.icu_usage,
    };
  } catch (error) {
    console.error('Error fetching hospital status:', error);
    // Return dummy data for demo
    return {
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
      patient_count: data.patient_count,
      icu_available: data.icu_available ?? (data.icu_usage ? 100 - data.icu_usage : undefined),
      beds_available: data.beds_available,
      staff_count: data.staff_count,
      occupancy_rate: data.occupancy_rate,
    };

    const response = await api.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.error('Error getting prediction:', error);
    // Return dummy prediction
    return {
      risk_level: data.patient_count > 130 ? 'high' : data.patient_count > 110 ? 'medium' : 'low',
      confidence: 0.85,
      recommendations: [
        'Increase ICU capacity by 20%',
        'Call in additional nursing staff',
        'Prepare emergency protocols',
      ],
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