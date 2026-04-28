 # CareNest

**Predict. Prepare. Prevent.**

---

## Description

CareNest is an intelligent healthcare system that predicts patient surges and helps hospitals optimize beds, ICU capacity, and staff in real time. It provides a live dashboard and early warning alerts to prevent overload and improve hospital readiness.

## Team

**InnoHub**

## Features

- 🔮 **Patient Surge Prediction** - ML-powered forecasting of patient admission patterns
- 📊 **Hospital Resource Optimization** - Intelligent bed and ICU capacity management
- 📈 **Real-time Dashboard** - Live monitoring of hospital status and metrics
- 🚨 **Early Warning Alert System** - Proactive notifications for bed and resource availability

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React, Tailwind CSS |
| **Backend** | FastAPI |
| **Machine Learning** | Scikit-learn |
| **Database** | SQLite |

## Project Structure

```
InnoHub_CareNest/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   ├── __init__.py
│   │   └── db.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── hospital_model.py
│   └── routes/
│       ├── __init__.py
│       ├── alerts.py
│       ├── hospital.py
│       └── predict.py
├── frontend/
│   └── (React + Tailwind setup)
├── PROGRESS.md
└── README.md
```

## How to Run Backend

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Setup Instructions

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. **Access the API:**
   - Server: `http://localhost:8000`
   - Interactive API docs: `http://localhost:8000/docs`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Get patient surge predictions |
| `/hospital-status` | GET | Fetch current hospital resource status |
| `/alerts` | GET | Retrieve active alerts and warnings |

## Future Improvements

- 🤖 Advanced ML model integration with real-time training
- 📡 Real-time data updates via WebSockets
- 🌐 Cloud deployment and scalability
- 📱 Mobile application support
- 🔐 Enhanced security and data privacy features
- 📊 Advanced analytics and reporting

---

**Made with ❤️ by InnoHub for the Hackathon**
