from fastapi import FastAPI
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

# Import the backend prediction wrapper which loads the ai-model module dynamically
from prediction import predict as ai_predict

app = FastAPI()

# Load CSV once at module import (no repeated I/O)
CSV_PATH = os.path.join(os.path.dirname(__file__), 'data', 'sample_hospital_data.csv')
try:
    data = pd.read_csv(CSV_PATH)
except Exception:
    # fall back to an empty DataFrame with expected columns
    data = pd.DataFrame(columns=['timestamp', 'patient_count', 'beds_available', 'icu_usage', 'staff_count', 'occupancy_rate'])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def root():
    return {"status": "running"}


@app.get("/hospital-status")
def hospital_status_demo(scenario: str = "normal"):
    return {
        "current_patients": DEMO_DATA[scenario]["current_patients"],
        "beds_available": DEMO_DATA[scenario]["beds_available"],
        "icu_available": DEMO_DATA[scenario]["icu_available"],
        "staff_available": DEMO_DATA[scenario]["staff_available"],
        "occupancy_rate": DEMO_DATA[scenario]["occupancy_rate"],
    }


@app.post("/predict")
def predict_demo(scenario: str = "normal"):
    return {
        "prediction": DEMO_DATA[scenario]["prediction"],
        "confidence": DEMO_DATA[scenario]["confidence"],
    }


@app.get("/alerts")
def alerts_demo(scenario: str = "normal"):
    return {
        "alert_level": DEMO_DATA[scenario]["alert_level"],
        "message": DEMO_DATA[scenario]["message"],
        "recommended_action": DEMO_DATA[scenario]["recommended_action"],
    }

# Controlled demo data
DEMO_DATA = {
    "normal": {
        "current_patients": 50,
        "beds_available": 100,
        "icu_available": 20,
        "staff_available": 50,
        "occupancy_rate": 33.33,
        "prediction": "Low Risk",
        "confidence": "95.00%",
        "alert_level": "GREEN",
        "message": "All systems normal",
        "recommended_action": "No action needed",
    },
    "warning": {
        "current_patients": 120,
        "beds_available": 80,
        "icu_available": 10,
        "staff_available": 40,
        "occupancy_rate": 60.00,
        "prediction": "Medium Risk",
        "confidence": "85.00%",
        "alert_level": "YELLOW",
        "message": "Approaching capacity",
        "recommended_action": "Prepare for surge",
    },
    "critical": {
        "current_patients": 200,
        "beds_available": 20,
        "icu_available": 5,
        "staff_available": 10,
        "occupancy_rate": 90.91,
        "prediction": "High Risk",
        "confidence": "99.00%",
        "alert_level": "RED",
        "message": "Overload risk",
        "recommended_action": "Expand capacity immediately",
    },
}