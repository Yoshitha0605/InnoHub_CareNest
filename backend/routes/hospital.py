from fastapi import APIRouter, HTTPException
from models.schemas import HospitalStatus
from utils.processing import load_data

router = APIRouter()


@router.get('/hospital-status')
def hospital_status():
    print("API HIT")
    df = load_data()
    if df is None or df.empty:
        raise HTTPException(status_code=404, detail='No hospital data available')

    latest = df.iloc[-1]

    patient_count = int(latest.get('patient_count', 0))
    beds_available = int(latest.get('beds_available', 0))
    icu_available = int(latest.get('icu_usage', 0)) if 'icu_usage' in latest else 0
    staff_available = int(latest.get('staff_count', 0)) if 'staff_count' in latest else 0

    denom = patient_count + beds_available
    occupancy_rate = round((patient_count / denom) * 100.0, 2) if denom > 0 else 0.0

    return {
        'current_patients': patient_count,
        'beds_available': beds_available,
        'icu_available': icu_available,
        'staff_available': staff_available,
        'occupancy_rate': occupancy_rate,
    }
