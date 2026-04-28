from typing import Optional
from typing import Optional
from pydantic import BaseModel

class HospitalData(BaseModel):
    patient_count: int
    icu_available: int
    beds_available: int
    staff_count: int
    occupancy_rate: Optional[float] = None
    emergency_cases: Optional[int] = None
    seasonal_factor: Optional[float] = None
    outbreak_factor: Optional[float] = None
    occupancy_rate: Optional[float] = None