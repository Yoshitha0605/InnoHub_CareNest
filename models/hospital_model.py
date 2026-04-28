from pydantic import BaseModel

class HospitalData(BaseModel):
    patient_count: int
    icu_usage: float
    beds_available: int
    staff_count: int