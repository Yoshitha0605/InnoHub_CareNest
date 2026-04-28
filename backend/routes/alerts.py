from fastapi import APIRouter

router = APIRouter()

@router.get("/alerts")
async def get_alerts():
    beds_available = 100
    icu_available = 20
    staff_count = 50
    patient_count = 90
    occupancy_rate = 90.0

    if patient_count > beds_available:
        alert_level = "RED"
        message = "High overload risk detected! Increase ICU beds and support staff immediately."
    elif occupancy_rate > 70:
        alert_level = "YELLOW"
        message = "Near capacity. Monitor admissions and prepare backup resources."
    else:
        alert_level = "GREEN"
        message = "Stable conditions. Continue standard monitoring."

    return {
        "alert_level": alert_level,
        "message": message,
        "patient_count": patient_count,
        "beds_available": beds_available,
        "icu_available": icu_available,
        "occupancy_rate": occupancy_rate,
    }