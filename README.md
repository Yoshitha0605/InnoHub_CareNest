# CareNest – AI-Powered Healthcare Monitoring System

## Description

CareNest is a smart healthcare dashboard that predicts patient load, monitors hospital resources, and generates alerts to help hospitals prepare for emergencies.

## Features

- Real-time hospital status monitoring
- AI-based patient load prediction
- Alert system (critical, warning, normal)
- Interactive dashboard UI
- FastAPI backend with ML integration

## Tech Stack

- Frontend: React (Vite)
- Backend: FastAPI
- AI Model: Random Forest (Scikit-learn)
- Data: CSV dataset

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

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

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

**Made with ❤️ by InnoHub for the Hackathon**
