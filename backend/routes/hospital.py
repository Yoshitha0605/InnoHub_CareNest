from fastapi import APIRouter

router = APIRouter()

@router.get("/hospital-status")
async def get_hospital_status():
    # Mock data
    mock_data = {
        "beds_available": 100,
        "icu_usage": 75.5,
        "staff_count": 50,
        "patient_count": 90
    }
    return mock_data