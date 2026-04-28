import joblib
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"
DEFAULT_SEASONAL = 1.0
DEFAULT_OUTBREAK = 0.0
DEFAULT_EMERGENCY_RATE = 0.14


def _load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError("AI model not found. Run ai-model/train_model.py to generate model.pkl.")

    payload = joblib.load(MODEL_PATH)
    model = payload.get("model") if isinstance(payload, dict) else payload
    feature_columns = payload.get("feature_columns") if isinstance(payload, dict) else None

    if model is None:
        raise ValueError("Loaded model file is invalid.")

    return model, feature_columns


def _safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(value, default=0):
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return default


def _build_input_record(payload, feature_columns):
    patient_count = _safe_int(payload.get("patient_count"), 0)
    beds_available = _safe_int(payload.get("beds_available"), 0)
    icu_available = _safe_int(payload.get("icu_available"), 0)
    staff_count = _safe_int(payload.get("staff_count"), 0)

    if beds_available <= 0:
        beds_available = max(1, patient_count + 10)

    emergency_cases = _safe_int(
        payload.get("emergency_cases"),
        max(5, round(patient_count * DEFAULT_EMERGENCY_RATE)),
    )
    seasonal_factor = _safe_float(payload.get("seasonal_factor"), DEFAULT_SEASONAL)
    outbreak_factor = _safe_float(payload.get("outbreak_factor"), DEFAULT_OUTBREAK)

    occupancy_rate = payload.get("occupancy_rate")
    if occupancy_rate is None:
        occupancy_rate = round((patient_count / beds_available) * 100, 2)
    else:
        occupancy_rate = _safe_float(occupancy_rate, 0.0)

    now = pd.Timestamp.now()
    record = {
        "patient_count": patient_count,
        "emergency_cases": emergency_cases,
        "beds_available": beds_available,
        "icu_available": icu_available,
        "staff_count": staff_count,
        "occupancy_rate": occupancy_rate,
        "seasonal_factor": seasonal_factor,
        "outbreak_factor": outbreak_factor,
        "hour": int(now.hour),
        "day_of_week": int(now.dayofweek),
        "day_of_month": int(now.day),
    }

    if feature_columns:
        record = {key: record.get(key, 0) for key in feature_columns}

    return pd.DataFrame([record])


def _classify_surge(predicted_count: int, beds_available: int, occupancy_rate: float) -> str:
    if predicted_count > beds_available:
        return "HIGH"
    if occupancy_rate > 70:
        return "MEDIUM"
    return "LOW"


def _recommend_action(surge_risk: str) -> str:
    if surge_risk == "HIGH":
        return "Increase ICU beds and staff immediately; activate surge protocols."
    if surge_risk == "MEDIUM":
        return "Expand monitoring and prepare backup beds and medical staff."
    return "Stable conditions. Maintain current staffing and continue monitoring hospital flow."


def predict(data):
    payload = data.dict() if hasattr(data, "dict") else dict(data)
    model, feature_columns = _load_model()
    input_df = _build_input_record(payload, feature_columns)

    try:
        prediction_value = model.predict(input_df)[0]
        predicted_patients = max(_safe_int(prediction_value, 0), 0)
    except Exception as exc:
        raise ValueError(f"Prediction failed: {exc}")

    beds_available = _safe_int(payload.get("beds_available"), 0)
    occupancy_rate = _safe_float(payload.get("occupancy_rate"), 0.0)
    if occupancy_rate == 0.0 and beds_available > 0:
        occupancy_rate = round((payload.get("patient_count", 0) / beds_available) * 100, 2)

    surge_risk = _classify_surge(predicted_patients, beds_available, occupancy_rate)
    recommended_action = _recommend_action(surge_risk)

    return {
        "predicted_patients_next_6hrs": predicted_patients,
        "surge_risk": surge_risk,
        "recommended_action": recommended_action,
    }
if __name__ == "__main__":
    sample_data = {
        "patient_count": 90,
        "beds_available": 100,
        "icu_available": 20,
        "staff_count": 50
    }

    result = predict(sample_data)
    print(result)
   