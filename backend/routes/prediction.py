from fastapi import APIRouter, Body
from typing import List
from models.schemas import PredictionResponse
from utils.processing import load_data

router = APIRouter()


@router.post('/predict')
def predict(payload: dict = Body(None)):
    print("API HIT")
    df = load_data()
    if df is None or df.empty:
        current = 0
        beds_available = 0
    else:
        latest = df.iloc[-1]
        current = int(latest.get('patient_count', 0))
        beds_available = int(latest.get('beds_available', 0))

    # allow overrides from payload
    try:
        if payload and payload.get('patient_count') is not None:
            current = int(payload.get('patient_count'))
    except Exception:
        pass
    try:
        if payload and payload.get('beds_available') is not None:
            beds_available = int(payload.get('beds_available'))
    except Exception:
        pass

    denom = current + beds_available
    occupancy = (current / denom) * 100.0 if denom > 0 else 0.0

    # simplified prediction: 20% increase
    predicted_patients = current * 1.2
    predicted_int = int(round(predicted_patients))

    # alert logic
    if predicted_patients > beds_available:
        surge = 'HIGH'
    elif occupancy > 80:
        surge = 'MEDIUM'
    else:
        surge = 'LOW'

    recommended_action = 'Increase staff / ICU / beds based on condition'

    return {
        'predicted_patients_next_6hrs': predicted_int,
        'surge_risk': surge,
        'recommended_action': recommended_action,
    }
