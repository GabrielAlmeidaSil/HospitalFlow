from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.atendimento import CriarAtendimento, RespostaAtendimento
from models.atendimento import StatusAtendimento
from services.atendimento_service import criar_atendimento_service, listar_atendimento_service

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


@router.get("/", response_model=list[RespostaAtendimento])
def listar_atendimentos(
      status: StatusAtendimento | None = None,
      paciente_id: int | None = None,
      setor_id: int | None = None,
      aberto: bool | None = None,
      db: Session = Depends(get_db)
    ):

    return listar_atendimento_service(
        db=db,
        status=status,
        paciente_id=paciente_id,
        setor_id=setor_id,
        aberto=aberto
    )
    