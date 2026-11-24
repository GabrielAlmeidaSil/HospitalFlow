from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.dashboard import ResumoDashboard
from services.dashboard import resumo_dashboard_service
from database import get_db


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/resumo", response_model=ResumoDashboard)
def resumo_dashboard(db: Session = Depends(get_db)):
    return resumo_dashboard_service(
        db=db
    )