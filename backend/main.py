from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import the backend prediction wrapper which loads the ai-model module dynamically
from prediction import predict as ai_predict

app = FastAPI()


class LoginRequest(BaseModel):
    username: str
    password: str
    role: Literal["Doctor", "Nurse", "Patient", "Family Member", "Admin"]


class LoginResponse(BaseModel):
    username: str
    role: str
    email: str


class PredictionResponse(BaseModel):
    predicted_patients: int
    risk_level: str
    confidence: str
    recommendations: list[str]


class PredictionRequest(BaseModel):
    patient_count: Optional[int] = 0
    beds_available: Optional[int] = 0
    icu_available: Optional[int] = 0
    staff_count: Optional[int] = 0
    occupancy_rate: Optional[float] = None
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


def confidence_for_risk(risk: str) -> str:
    level = risk.upper() if isinstance(risk, str) else "LOW"
    if level == "HIGH":
        return "92%"
    if level == "MEDIUM":
        return "85%"
    return "96%"


def build_prediction_response(result: dict) -> dict:
    risk = result.get("surge_risk") or result.get("risk_level") or "Low"
    if isinstance(risk, str):
        risk = risk.title()
    return {
        "predicted_patients": int(result.get("predicted_patients_next_6hrs", result.get("predicted_patients", 0)) or 0),
        "risk_level": risk,
        "confidence": result.get("confidence") or confidence_for_risk(str(risk)),
        "recommendations": [result.get("recommended_action", "Monitor hospital capacity and prepare resources")],
    }


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
def login(data: dict):
    username = data.get("username") or "DemoUser"
    role = data.get("role") or "Admin"

    return {
        "username": username,
        "role": role,
        "email": f"{username.lower()}@carenest.com",
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
def hospital_status(scenario: Optional[str] = "normal"):
    selected = normalize_scenario(scenario)
    hospital = DEMO_DATA[selected]
    return {
        "hospital_name": "Metro General Hospital",
        "hospital_region": "Central City",
        "status_level": selected,
        "current_patients": hospital["current_patients"],
        "patient_count": hospital["current_patients"],
        "beds_available": hospital["beds_available"],
        "icu_available": hospital["icu_available"],
        "staff_count": hospital["staff_available"],
        "occupancy_rate": hospital["occupancy_rate"],
        "alert_level": hospital["alert_level"],
        "prediction": hospital["prediction"],
        "confidence": hospital["confidence"],
        "recommended_action": hospital["recommended_action"],
        "last_updated": datetime.utcnow().isoformat() + "Z",
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_route(request: PredictionRequest):
    payload = request.dict(exclude_none=True)
    if not payload:
        raise HTTPException(status_code=400, detail="Prediction input is required")
    
    # Extract input data
    patient_count = payload.get("patient_count", 90)
    beds_available = payload.get("beds_available", 100)
    occupancy_rate = payload.get("occupancy_rate", 50.0)
    
    # Calculate predicted patients (6-hour forecast)
    if occupancy_rate and occupancy_rate > 0:
        predicted = int(patient_count * 1.15) if occupancy_rate > 85 else int(patient_count * 1.08) if occupancy_rate > 60 else int(patient_count * 1.03)
    else:
        predicted = int(patient_count * 1.08)
    
    # Dynamic risk calculation based on actual data
    if occupancy_rate > 85 or patient_count > beds_available:
        risk_level = "High"
        confidence = "92%"
        recommendations = [
            "Immediately increase ICU capacity by 30%",
            "Deploy additional nursing and medical staff",
            "Activate emergency surge protocols",
        ]
    elif occupancy_rate > 60 or patient_count > (beds_available * 0.75):
        risk_level = "Medium"
        confidence = "85%"
        recommendations = [
            "Prepare surge beds for activation",
            "Notify on-call staff to remain available",
            "Monitor occupancy closely over next 6 hours",
        ]
    else:
        risk_level = "Low"
        confidence = "96%"
        recommendations = [
            "Continue normal operations",
            "Monitor capacity trends",
            "Maintain current staffing levels",
        ]
    
    return {
        "predicted_patients": predicted,
        "risk_level": risk_level,
        "confidence": confidence,
        "recommendations": recommendations,
    }


@app.get("/alerts")
def alerts(occupancy_rate: Optional[float] = None, patient_count: Optional[int] = None):
    if occupancy_rate is None:
        occupancy_rate = 72.0
    if patient_count is None:
        patient_count = 145
    
    if occupancy_rate > 85 or patient_count > 150:
        alert_level = "RED"
        title = "Critical Alert"
        message = "Hospital capacity critically high. Immediate surge protocols required."
    elif occupancy_rate > 60 or patient_count > 120:
        alert_level = "YELLOW"
        title = "Warning Alert"
        message = "Hospital approaching capacity limits. Monitor situation closely."
    else:
        alert_level = "GREEN"
        title = "Status OK"
        message = "Hospital operating at normal capacity levels."
    
    return {
        "title": title,
        "message": message,
        "alert_level": alert_level,
        "recommended_action": "Monitor and prepare resources" if alert_level != "GREEN" else "Continue normal operations",
        "patient_count": patient_count,
        "beds_available": 200 - patient_count,
        "icu_available": 50 - int(patient_count * 0.15),
        "occupancy_rate": occupancy_rate,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@app.get("/generate-report")
def generate_report(report_type: Optional[str] = "summary"):
    status = DEMO_DATA["warning"]
    return {
        "report_type": report_type,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "hospital_name": "Metro General Hospital",
        "hospital_region": "Central City",
        "summary": {
            "current_patients": status["current_patients"],
            "beds_available": status["beds_available"],
            "icu_available": status["icu_available"],
            "occupancy_rate": status["occupancy_rate"],
            "alert_level": status["alert_level"],
        },
        "recommended_action": status["recommended_action"],
        "prediction": status["prediction"],
        "confidence": status["confidence"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)