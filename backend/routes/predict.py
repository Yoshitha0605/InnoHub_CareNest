from fastapi import APIRouter, HTTPException
from models.hospital_model import HospitalData
from prediction import predict as run_prediction

router = APIRouter()

@router.post("/predict")
async def predict_overload_risk(data: HospitalData):
    try:
        return run_prediction(data)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}")