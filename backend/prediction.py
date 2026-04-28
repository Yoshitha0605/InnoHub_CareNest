import importlib.util
from pathlib import Path

AI_MODULE_DIR = Path(__file__).resolve().parent.parent / "ai-model"
PREDICTION_PATH = AI_MODULE_DIR / "prediction.py"


def _load_prediction_module():
    if not PREDICTION_PATH.exists():
        raise FileNotFoundError("AI prediction module not found. Run ai-model/train_model.py to generate ai-model/model.pkl.")

    spec = importlib.util.spec_from_file_location("ai_model_prediction", PREDICTION_PATH)
    if spec is None or spec.loader is None:
        raise ImportError("Unable to load prediction module from ai-model folder.")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def predict(data):
    module = _load_prediction_module()
    return module.predict(data)
