from fastapi import APIRouter
from models.schemas import AlertModel
from utils.processing import load_data
from datetime import datetime

router = APIRouter()

<<<<<<< HEAD

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
=======
@router.get("/alerts")
async def get_alerts():
    beds_available = 100
    icu_available = 20
    staff_count = 50
    patient_count = 90
    occupancy_rate = 90.0

    if patient_count > beds_available:
        alert_level = "RED"
        message = "High overload risk detected! Increase ICU beds and support staff immediately."
    elif occupancy_rate > 70:
        alert_level = "YELLOW"
        message = "Near capacity. Monitor admissions and prepare backup resources."
    else:
        alert_level = "GREEN"
        message = "Stable conditions. Continue standard monitoring."

    return {
        "alert_level": alert_level,
        "message": message,
        "patient_count": patient_count,
        "beds_available": beds_available,
        "icu_available": icu_available,
        "occupancy_rate": occupancy_rate,
    }
>>>>>>> 5f53575dc0e853d5dc6700a6ff080ee8e4ccf076
