# CareNest – AI-Powered Healthcare Monitoring System

## Description

CareNest is a smart healthcare dashboard designed to monitor hospital resources, predict patient load using AI, and generate alerts to help hospitals proactively manage emergencies.

## Features

- Real-time hospital status monitoring
- AI-based patient load prediction
- Alert system (Critical / Warning / Normal)
- Interactive dashboard UI
- Settings and notification controls
- Role-based system (in progress)
- Report generation (in progress)

## Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router

### Backend
- FastAPI (Python)

### AI
- Random Forest (Scikit-learn)

### Data
- CSV dataset

## API Endpoints

- GET /hospital-status
- POST /predict
- GET /alerts
- POST /login (basic implementation)

## Setup Instructions

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
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
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── AlertsPanel.jsx
│   │   │   └── PredictionForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── charts/
│   │   │   └── PatientLoadChart.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── PROGRESS.md
└── README.md
```

## Current Status

- ✅ Backend fully functional with AI integration
- ✅ Frontend UI completed with dashboard, settings, and login
- ⚠️ Frontend-backend integration in progress
- ⚠️ Authentication system being implemented
- ❌ Advanced features pending (reports, analytics)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is developed for the InnoHub Hackathon.

**Made with ❤️ by InnoHub Team**
