from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.dashboard import ResumoDashboard, OcupacaoPorSetor, DistribuicaoAtendimentos
from services.dashboard import resumo_dashboard_service, ocupacao_setores_service, distribuicao_atendimentos_service
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

@router.get("/ocupacao-setores", response_model=list[OcupacaoPorSetor])
def ocupacao_por_setor(db: Session = Depends(get_db)):
    return ocupacao_setores_service(
        db=db
    )

@router.get("/distribuicao-atendimentos", response_model=list[DistribuicaoAtendimentos])
def distribuicao_atendimentos(db: Session = Depends(get_db)):
    return distribuicao_atendimentos_service(
        db=db
    )