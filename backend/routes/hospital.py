from fastapi import APIRouter

router = APIRouter()

@router.get("/hospital-status")
async def get_hospital_status():
    mock_data = {
        "beds_available": 100,
        "icu_available": 20,
        "staff_count": 50,
        "patient_count": 90,
        "occupancy_rate": 90.0,
    }
    return mock_data