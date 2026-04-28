import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

export const getHospitalStatus = async () => {
  try {
    const response = await api.get('/hospital-status');
    return response.data;
  } catch (error) {
    console.error('Error fetching hospital status:', error);
    // Return dummy data for demo
    return {
      patient_count: 145,
      icu_usage: 78,
      beds_available: 85,
      staff_count: 42,
      occupancy_rate: 72
    };
  }
};

export const getPrediction = async (data) => {
  try {
    const response = await api.post('/predict', data);
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
        'Prepare emergency protocols'
      ]
    };
  }
};

export const getAlerts = async () => {
  try {
    const response = await api.get('/alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    // Return dummy alert
    return {
      title: 'High Patient Load Alert',
      message: 'Current patient count exceeds 70% capacity. Prepare for surge.',
      risk_level: 'high',
      timestamp: new Date().toISOString()
    };
  }
};