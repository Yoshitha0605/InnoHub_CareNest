from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "dataset.csv"


def load_raw_data():
    df = pd.read_csv(DATA_PATH, parse_dates=["timestamp"])
    return df


def preprocess_data():
    df = load_raw_data()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    # Required numeric fields
    numeric_columns = [
        "patient_count",
        "emergency_cases",
        "beds_available",
        "icu_available",
        "staff_count",
        "occupancy_rate",
        "seasonal_factor",
        "outbreak_factor",
    ]

    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["timestamp", "patient_count", "beds_available", "icu_available", "staff_count", "next_patient_count"])

    df["emergency_cases"] = df["emergency_cases"].fillna(df["emergency_cases"].median())
    df["seasonal_factor"] = df["seasonal_factor"].fillna(1.0)
    df["outbreak_factor"] = df["outbreak_factor"].fillna(0.0)
    df["occupancy_rate"] = df["occupancy_rate"].fillna(
        (df["patient_count"] / df["beds_available"] * 100).round(2)
    )

    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["day_of_month"] = df["timestamp"].dt.day

    feature_columns = [
        "patient_count",
        "emergency_cases",
        "beds_available",
        "icu_available",
        "staff_count",
        "occupancy_rate",
        "seasonal_factor",
        "outbreak_factor",
        "hour",
        "day_of_week",
        "day_of_month",
    ]

    X = df[feature_columns]
    y = df["next_patient_count"]

    return X, y
