import requests
import json
from requests.exceptions import RequestException

BASE = 'http://127.0.0.1:8000'


def print_section(title: str, data):
    print('\n--- {} ---'.format(title))
    if isinstance(data, dict):
        print(json.dumps(data, indent=2))
    else:
        print(data)


def get_hospital_status():
    url = f"{BASE}/hospital-status"
    try:
        resp = requests.get(url, timeout=5)
        if resp.ok:
            return resp.json()
        return f"HTTP {resp.status_code}: {resp.text}"
    except RequestException as e:
        return f"Connection error: {e}"


def post_predict(payload: dict):
    url = f"{BASE}/predict"
    headers = {'Content-Type': 'application/json'}
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.ok:
            return resp.json()
        return f"HTTP {resp.status_code}: {resp.text}"
    except RequestException as e:
        return f"Connection error: {e}"


def get_alerts():
    url = f"{BASE}/alerts"
    try:
        resp = requests.get(url, timeout=5)
        if resp.ok:
            return resp.json()
        return f"HTTP {resp.status_code}: {resp.text}"
    except RequestException as e:
        return f"Connection error: {e}"


def main():
    # Test GET /hospital-status
    status = get_hospital_status()
    print_section('HOSPITAL STATUS', status)

    # Test POST /predict
    payload = {
        "patient_count": 90,
        "beds_available": 100,
        "icu_available": 20,
        "staff_count": 50
    }
    prediction = post_predict(payload)
    print_section('PREDICTION', prediction)

    # Test GET /alerts
    alert = get_alerts()
    print_section('ALERT', alert)


if __name__ == '__main__':
    main()
