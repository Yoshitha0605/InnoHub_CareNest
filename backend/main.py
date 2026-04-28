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
        "patient_count": DEMO_DATA[scenario]["current_patients"],
        "beds_available": DEMO_DATA[scenario]["beds_available"],
        "icu_available": DEMO_DATA[scenario]["icu_available"],
        "staff_count": DEMO_DATA[scenario]["staff_available"],
        "occupancy_rate": DEMO_DATA[scenario]["occupancy_rate"],
    }


@app.post("/predict")
def predict(data: dict):
    try:
        result = ai_predict(data)
        return {
            "predicted_patients_next_6hrs": result.get("predicted_patients_next_6hrs", 0),
            "surge_risk": result.get("surge_risk", "UNKNOWN"),
            "recommended_action": result.get("recommended_action", "No recommendation available")
        }
    except Exception as e:
        # Fallback to demo data if AI prediction fails
        print(f"AI prediction failed: {e}")
        scenario = "critical" if data.get("patient_count", 0) > 150 else "warning" if data.get("patient_count", 0) > 100 else "normal"
        return {
            "predicted_patients_next_6hrs": DEMO_DATA[scenario]["current_patients"] + 10,
            "surge_risk": DEMO_DATA[scenario]["prediction"].split()[0].upper(),  # Extract "Low", "Medium", "High"
            "recommended_action": DEMO_DATA[scenario]["recommended_action"]
        }


@app.get("/alerts")
def alerts_demo(scenario: str = "normal"):
    alert_data = DEMO_DATA[scenario]
    return [{
        "title": "Critical Alert" if alert_data["alert_level"] == "RED" else "Warning Alert" if alert_data["alert_level"] == "YELLOW" else "Status OK",
        "message": alert_data["message"],
        "level": alert_data["alert_level"].lower(),
        "patient_count": alert_data["current_patients"],
        "beds_available": alert_data["beds_available"],
        "icu_available": alert_data["icu_available"],
        "occupancy_rate": alert_data["occupancy_rate"],
        "timestamp": "2024-01-15T10:30:00Z",  # Mock timestamp
    }]

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)