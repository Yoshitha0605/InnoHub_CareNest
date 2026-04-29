# CareNest — AI-Powered Healthcare Monitoring System

## Overview
CareNest is a healthcare operations dashboard that monitors hospital resources, predicts patient load using AI, and supports proactive hospital management through alerts and reporting.

## Key Features
- Real-time hospital resource monitoring
- AI-based patient load prediction
- Risk level classification (Low / Medium / High)
- Alerts and operational notifications
- Dashboard pages for analytics, reports, and settings
- Login and session handling
- Report generation and export support

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- JavaScript, HTML, CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pandas

### AI / ML
- Scikit-learn
- Random Forest
- Pickle / Joblib model serialization

## API Endpoints
- GET /hospital-status
- POST /predict
- GET /alerts
- GET /generate-report
- POST /login

## Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Frontend
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
│   │   │   ├── AlertCard.jsx
│   │   │   ├── AlertsPanel.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   └── RecommendationCard.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Signup.jsx
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
CareNest is implemented as a stable minimum viable product with full backend and frontend integration. Core functionality is complete and the system is ready for demonstration.

### Status Summary
- ✅ Backend implemented and operational
- ✅ AI prediction integrated
- ✅ Frontend dashboard completed
- ✅ API integration between frontend and backend
- ✅ Core reports and alerts workflow functional
- ⚠️ Additional enhancements remain for production polish

## Next Steps
- Improve analytics visualization
- Enhance authentication and role-based access
- Add additional report formats and export options
- Refine UI responsiveness and production readiness

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make updates
4. Test changes
5. Submit a pull request

## License
This repository is developed for the InnoHub project.
