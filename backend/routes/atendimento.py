from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.atendimento import CriarAtendimento, RespostaAtendimento
from services.atendimento_service import criar_atendimento_service

router = APIRouter(
    prefix="/atendimentos",
    tags=["Atendimentos"]
)

@router.post("/", status_code=201, response_model=RespostaAtendimento)
def criar_atendimento(dados: CriarAtendimento, db: Session = Depends(get_db)):
    return criar_atendimento_service(
        db=db,
        dados=dados
    )