from fastapi import APIRouter
from models.schemas import AlertModel
from utils.processing import load_data
from datetime import datetime

router = APIRouter()


@router.get('/alerts', response_model=AlertModel)
def get_alerts():
    print("API HIT")
    df = load_data()
    if df is None or df.empty:
        patient_count = 0
        beds_available = 0
    else:
        latest = df.iloc[-1]
        patient_count = int(latest.get('patient_count', 0))
        beds_available = int(latest.get('beds_available', 0))

    denom = patient_count + beds_available
    occupancy = (patient_count / denom) * 100.0 if denom > 0 else 0.0

    predicted_patients = patient_count * 1.2

    if predicted_patients > beds_available:
        alert_level = 'RED'
        message = 'Hospital overload likely'
        recommended_action = 'Activate surge protocols; increase ICU and beds'
    elif occupancy > 80:
        alert_level = 'YELLOW'
        message = 'Hospital nearing capacity'
        recommended_action = 'Prepare additional staff and free up beds'
    else:
        alert_level = 'GREEN'
        message = 'Hospital stable'
        recommended_action = 'Continue monitoring'

    return {
        'alert_level': alert_level,
        'message': message,
        'recommended_action': recommended_action,
    }
