from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from typing import List
from app.agents import plan_trip

# ── Rate limiter ───────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="AI Traveller Planner", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ────────────────────────────────────────────────────────────────────
class PlanRequest(BaseModel):
    city: str
    interests: List[str]

class PlanResponse(BaseModel):
    city: str
    interests: List[str]
    itinerary: str

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "AI Traveller Planner API is running 🌍"}


@app.post("/plan", response_model=PlanResponse)
@limiter.limit("10/minute")
def plan(request: Request, body: PlanRequest):
    """
    Generate a day-trip itinerary.

    - **city**: Destination city (e.g. "Paris")
    - **interests**: List of interests (e.g. ["art", "food", "history"])
    """
    itinerary = plan_trip(city=body.city, interests=body.interests)
    return PlanResponse(
        city=body.city,
        interests=body.interests,
        itinerary=itinerary
    )