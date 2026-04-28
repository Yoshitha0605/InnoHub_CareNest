from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router
from routes.hospital import router as hospital_router
from routes.alerts import router as alerts_router

# Initialize FastAPI app
app = FastAPI(title="CareNest Backend", description="Healthcare system backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict_router)
app.include_router(hospital_router)
app.include_router(alerts_router)

@app.get("/")
async def root():
    return {"message": "CareNest Backend Running"}