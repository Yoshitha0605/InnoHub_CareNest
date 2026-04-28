from pydantic import BaseModel
from typing import List, Optional


class HospitalStatus(BaseModel):
    patient_count: int
    beds_available: int
    icu_usage: float
    staff_count: int
    occupancy_rate: float


class PredictionPoint(BaseModel):
    hour: int
    predicted_patients: int


class PredictionResponse(BaseModel):
    predictions: List[PredictionPoint]
    risk_level: str
    confidence: float
    recommendations: List[str]


class AlertModel(BaseModel):
    alert_level: str
    message: str
    recommended_action: str
    timestamp: Optional[str] = None
