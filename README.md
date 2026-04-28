# CareNest – AI-Powered Healthcare Monitoring System

## Description

A smart healthcare dashboard that predicts patient load, monitors hospital resources, and generates alerts to help hospitals prepare for emergencies.

## Features

- Real-time hospital status monitoring
- AI-based patient load prediction
- Alert system (critical, warning, normal)
- Interactive dashboard UI
- FastAPI backend with ML integration

## Tech Stack

- Frontend: React
- Backend: FastAPI
- AI Model: Random Forest (Scikit-learn)
- Data: CSV-based dataset

## APIs

- `GET /hospital-status`
- `POST /predict`
- `GET /alerts`

## Current Status

- Backend fully functional
- AI integration complete
- Frontend UI completed
- Partial frontend functionality (ongoing improvements)

## Setup Instructions

### Backend

```bash
cd backend
uvicorn main:app --reload --port 8002
```

### Notes

- Ensure `requirements.txt` is installed in the `backend/` folder before starting the server.
- The backend exposes a demo-ready prediction API and hospital monitoring endpoints for the frontend.

## Project Structure

```
InnoHub_CareNest/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── data/
│   │   ├── dataset.csv
│   │   └── sample_hospital_data.csv
│   ├── model.pkl
│   ├── database/
│   │   ├── __init__.py
│   │   └── db.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── hospital_model.py
│   │   └── schemas.py
│   ├── routes/
│   │   ├── alerts.py
│   │   ├── hospital.py
│   │   ├── predict.py
│   │   └── prediction.py
│   └── utils/
│       └── processing.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── PROGRESS.md
└── README.md
```

## Contact

Built by the InnoHub team for the hackathon demo.
