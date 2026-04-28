from fastapi import FastAPI
import pandas as pd
import os

app = FastAPI()

# Load CSV once at module import (no repeated I/O)
CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'sample_hospital_data.csv')
try:
    data = pd.read_csv(CSV_PATH)
except Exception:
    # fall back to an empty DataFrame with expected columns
    data = pd.DataFrame(columns=['timestamp', 'patient_count', 'beds_available', 'icu_usage', 'staff_count', 'occupancy_rate'])


@app.get("/")
def root():
    return {"status": "running"}


@app.get("/hospital-status")
def hospital_status():
    # Use only the latest record from the pre-loaded CSV
    if data is None or data.empty:
        return {
            "current_patients": 0,
            "beds_available": 0,
            "icu_available": 0,
            "staff_available": 0,
            "occupancy_rate": 0.0,
        }

    latest = data.iloc[-1]

    patient_count = latest.get('patient_count', 0)
    beds_available = latest.get('beds_available', 0)
    # CSV uses 'icu_usage' column name; expose it as 'icu_available'
    icu_available = latest.get('icu_usage', 0)
    staff_count = latest.get('staff_count', 0)

    try:
        denom = float(patient_count) + float(beds_available)
        occupancy = (float(patient_count) / denom) * 100.0 if denom > 0 else 0.0
    except Exception:
        occupancy = 0.0

    return {
        "current_patients": int(patient_count),
        "beds_available": int(beds_available),
        "icu_available": int(icu_available),
        "staff_available": int(staff_count),
        "occupancy_rate": round(occupancy, 2),
    }


@app.post("/predict")
def predict():
    return {
        "predicted_patients_next_6hrs": 120,
        "surge_risk": "HIGH",
        "recommended_action": "Increase resources",
    }


@app.get("/alerts")
def alerts():
    return {
        "alert_level": "RED",
        "message": "Overload risk",
        "recommended_action": "Expand capacity",
    }