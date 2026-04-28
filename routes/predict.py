from fastapi import APIRouter
from models.hospital_model import HospitalData

router = APIRouter()

@router.post("/predict")
async def predict_overload_risk(data: HospitalData):
    # Simple logic for overload risk
    if data.patient_count > data.beds_available:
        risk = "high"
    elif data.icu_usage > 80:
        risk = "medium"
    else:
        risk = "low"
    
    return {"overload_risk": risk}