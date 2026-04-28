from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Literal
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

# Import the backend prediction wrapper which loads the ai-model module dynamically
from prediction import predict as ai_predict

app = FastAPI()


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    status: str
    role: str
    token: str


class PredictionResponse(BaseModel):
    predicted_patients: int
    risk_level: str
    confidence: str
    recommendations: list[str]


class PredictionRequest(BaseModel):
    scenario: Optional[Literal["normal", "warning", "critical"]]


PREDICTION_SCENARIOS = {
    "normal": {
        "predicted_patients": 90,
        "risk_level": "Low",
        "confidence": "95%",
        "recommendations": [
            "Monitor capacity",
            "Maintain current staffing",
        ],
    },
    "warning": {
        "predicted_patients": 140,
        "risk_level": "Medium",
        "confidence": "82%",
        "recommendations": [
            "Prepare surge beds",
            "Notify on-call staff",
        ],
    },
    "critical": {
        "predicted_patients": 220,
        "risk_level": "High",
        "confidence": "92%",
        "recommendations": [
            "Increase ICU capacity",
            "Deploy additional staff",
        ],
    },
}


def normalize_scenario(scenario: Optional[str]) -> str:
    if scenario and scenario.lower() in PREDICTION_SCENARIOS:
        return scenario.lower()
    return "normal"


class AlertThresholds(BaseModel):
    patient_count: int = 150
    occupancy_rate: float = 85.0
    icu_usage: int = 80


class NotificationPreferences(BaseModel):
    email: bool = True
    sms: bool = False
    push: bool = True


class SettingsResponse(BaseModel):
    alert_thresholds: AlertThresholds
    notification_preferences: NotificationPreferences
    theme_mode: str


class SettingsUpdate(BaseModel):
    alert_thresholds: Optional[AlertThresholds] = None
    notification_preferences: Optional[NotificationPreferences] = None
    theme_mode: Optional[str] = None


SETTINGS = {
    "alert_thresholds": {
        "patient_count": 150,
        "occupancy_rate": 85.0,
        "icu_usage": 80,
    },
    "notification_preferences": {
        "email": True,
        "sms": False,
        "push": True,
    },
    "theme_mode": "light",
}


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


@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    return {
        "status": "success",
        "role": "admin",
        "token": "demo-token",
    }


@app.get("/settings", response_model=SettingsResponse)
def get_settings():
    return SETTINGS


@app.post("/settings", response_model=SettingsResponse)
def update_settings(update: SettingsUpdate):
    if update.alert_thresholds is not None:
        SETTINGS["alert_thresholds"] = update.alert_thresholds.dict()
    if update.notification_preferences is not None:
        SETTINGS["notification_preferences"] = update.notification_preferences.dict()
    if update.theme_mode is not None:
        SETTINGS["theme_mode"] = update.theme_mode
    return SETTINGS


@app.get("/hospital-status")
def hospital_status_demo(scenario: str = "normal"):
    selected = scenario if scenario in DEMO_DATA else "normal"
    return {
<<<<<<< HEAD
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
=======
        "current_patients": DEMO_DATA[selected]["current_patients"],
        "beds_available": DEMO_DATA[selected]["beds_available"],
        "icu_available": DEMO_DATA[selected]["icu_available"],
        "staff_available": DEMO_DATA[selected]["staff_available"],
        "occupancy_rate": DEMO_DATA[selected]["occupancy_rate"],
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_demo(request: Optional[PredictionRequest] = None, scenario: str = "normal"):
    selected = scenario
    if request and request.scenario:
        selected = request.scenario
    selected = normalize_scenario(selected)
    return PREDICTION_SCENARIOS[selected]
>>>>>>> 2e5360438a803d4883e3ef93aa6d642a743e76b5


@app.get("/alerts")
def alerts_demo(scenario: str = "normal"):
<<<<<<< HEAD
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
=======
    selected = scenario if scenario in DEMO_DATA else "normal"
    return {
        "alert_level": DEMO_DATA[selected]["alert_level"],
        "message": DEMO_DATA[selected]["message"],
        "recommended_action": DEMO_DATA[selected]["recommended_action"],
    }
>>>>>>> 2e5360438a803d4883e3ef93aa6d642a743e76b5

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