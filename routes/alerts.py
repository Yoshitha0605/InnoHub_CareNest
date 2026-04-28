from fastapi import APIRouter

router = APIRouter()

@router.get("/alerts")
async def get_alerts():
    # Get mock data (same as hospital status)
    beds_available = 100
    icu_usage = 75.5
    staff_count = 50
    patient_count = 90
    
    # Compute overload risk
    if patient_count > beds_available:
        risk = "high"
    elif icu_usage > 80:
        risk = "medium"
    else:
        risk = "low"
    
    if risk == "high":
        return {"alert": "High overload risk detected! Immediate action required."}
    else:
        return {"alert": "All systems normal"}