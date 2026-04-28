import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "dataset.csv"
MODEL_PATH = BASE_DIR / "model.pkl"


def train_and_save_model():
    df = pd.read_csv(DATA_PATH)
    feature_columns = ["patient_count", "beds_available", "icu_usage", "staff_count", "occupancy_rate"]
    target_column = "next_patient_count"

    X = df[feature_columns]
    y = df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)
    joblib.dump(model, MODEL_PATH)

    print(f"Model trained and saved to {MODEL_PATH}")
    print(f"Test R^2 score: {score:.4f}")


if __name__ == "__main__":
    train_and_save_model()
