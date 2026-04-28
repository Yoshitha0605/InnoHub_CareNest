import os
from typing import Dict, Any, List, Tuple
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'data', 'sample_hospital_data.csv')

# Load CSV once at module import to avoid repeated I/O
try:
    DATA_DF = pd.read_csv(CSV_PATH, parse_dates=['timestamp'])
except Exception:
    cols = ['timestamp', 'patient_count', 'beds_available', 'icu_usage', 'staff_count', 'occupancy_rate']
    DATA_DF = pd.DataFrame(columns=cols)


def load_data(csv_path: str = CSV_PATH) -> pd.DataFrame:
    """Return the already-loaded DataFrame (no repeated reads)."""
    return DATA_DF


def get_latest_record(df: pd.DataFrame) -> Dict[str, Any]:
    """Return latest row as dict with typed values. Safe defaults if missing."""
    if df is None or df.empty:
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'patient_count': 0,
            'beds_available': 0,
            'icu_usage': 0.0,
            'staff_count': 0,
            'occupancy_rate': 0.0,
        }
    try:
        row = df.sort_values('timestamp').iloc[-1]
        return {
            'timestamp': row.get('timestamp').isoformat() if not pd.isna(row.get('timestamp')) else datetime.utcnow().isoformat(),
            'patient_count': int(row.get('patient_count', 0) if not pd.isna(row.get('patient_count')) else 0),
            'beds_available': int(row.get('beds_available', 0) if not pd.isna(row.get('beds_available')) else 0),
            'icu_usage': float(row.get('icu_usage', 0.0) if not pd.isna(row.get('icu_usage')) else 0.0),
            'staff_count': int(row.get('staff_count', 0) if not pd.isna(row.get('staff_count')) else 0),
            'occupancy_rate': float(row.get('occupancy_rate', 0.0) if not pd.isna(row.get('occupancy_rate')) else 0.0),
        }
    except Exception:
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'patient_count': 0,
            'beds_available': 0,
            'icu_usage': 0.0,
            'staff_count': 0,
            'occupancy_rate': 0.0,
        }


def calculate_occupancy(patient_count: int, beds_available: int) -> float:
    """Calculate occupancy as percentage safely."""
    try:
        denom = patient_count + beds_available
        if denom <= 0:
            return 0.0
        return round((patient_count / denom) * 100.0, 2)
    except Exception:
        return 0.0


def predict_next_6hrs(current_patients: int, rate: float = 0.2) -> List[int]:
    """Predict next 6 hours using closed-form compound growth (no loops).

    Returns list of 6 integer predictions derived from formula.
    """
    try:
        base = float(current_patients)
        # compound growth: value * (1+rate)**h
        preds = [int(round(base * ((1.0 + rate) ** h))) for h in range(1, 7)]
        return preds
    except Exception:
        return [int(current_patients)] * 6


def predict_patients(current_patients: int, rate: float = 0.2) -> dict:
    """Return predicted values for next 6 hours and final predicted patients.

    Returns dict with 'predictions' (list) and 'predicted_after_6h' (int).
    """
    preds = predict_next_6hrs(current_patients, rate=rate)
    predicted_after_6h = int(preds[-1]) if preds else int(current_patients)
    return {'predictions': preds, 'predicted_after_6h': predicted_after_6h}


def assess_surge_risk(predicted_list: List[int], beds_available: int, occupancy: float) -> Tuple[str, float]:
    """Return surge risk label and confidence (0-1).

    Simple heuristic:
    - HIGH if max(predicted) > beds_available
    - MEDIUM if occupancy > 80 or max(predicted) within 10% of beds
    - LOW otherwise
    """
    try:
        max_pred = max(predicted_list) if predicted_list else 0
        if beds_available is None:
            beds_available = 0
        if max_pred > beds_available:
            return 'HIGH', 0.9
        if occupancy > 80 or (beds_available > 0 and max_pred > 0.9 * beds_available):
            return 'MEDIUM', 0.7
        return 'LOW', 0.5
    except Exception:
        return 'LOW', 0.4


def generate_recommendations(risk: str) -> List[str]:
    if risk == 'HIGH':
        return [
            'Activate overflow protocol and open surge wards',
            'Mobilize additional ICU staff and resources',
            'Initiate patient diversion agreements'
        ]
    if risk == 'MEDIUM':
        return [
            'Schedule extra nursing shifts',
            'Optimize discharge planning to free beds',
        ]
    return ['Maintain operations and monitor closely']


def compute_alert_level(predicted_max: int, beds_available: int, occupancy: float) -> Dict[str, str]:
    """Compute alert level using provided business rules."""
    try:
        if predicted_max > beds_available:
            return {'alert_level': 'RED', 'message': 'Predicted patients exceed available beds', 'recommended_action': 'Activate surge/overflow protocols'}
        if occupancy > 80:
            return {'alert_level': 'YELLOW', 'message': 'Occupancy over 80%', 'recommended_action': 'Prepare additional resources and staff'}
        return {'alert_level': 'GREEN', 'message': 'Stable operations', 'recommended_action': 'Continue monitoring'}
    except Exception:
        return {'alert_level': 'GREEN', 'message': 'Insufficient data', 'recommended_action': 'Collect more data'}


def generate_alert(predicted_patients: int, beds_available: int, occupancy: float) -> Dict[str, str]:
    """Wrapper that produces alert_level, message, and recommended_action per user rules.

    Rules:
      if predicted_patients > beds_available -> RED
      elif occupancy > 80 -> YELLOW
      else -> GREEN
    """
    try:
        if predicted_patients > beds_available:
            return {
                'alert_level': 'RED',
                'message': 'Hospital overload likely',
                'recommended_action': 'Activate surge protocols; increase ICU and beds'
            }
        if occupancy > 80:
            return {
                'alert_level': 'YELLOW',
                'message': 'Hospital nearing capacity',
                'recommended_action': 'Prepare additional staff and free up beds'
            }
        return {
            'alert_level': 'GREEN',
            'message': 'Hospital operating within normal parameters',
            'recommended_action': 'Continue monitoring'
        }
    except Exception:
        return {
            'alert_level': 'GREEN',
            'message': 'Insufficient data',
            'recommended_action': 'Collect more data'
        }
