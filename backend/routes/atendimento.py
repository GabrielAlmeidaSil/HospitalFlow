from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.atendimento import CriarAtendimento, RespostaAtendimento, ResumoAtendimentos, AlterarStatusAtendimento, TransferirAtendimento
from models.atendimento import StatusAtendimento
from services.atendimento_service import criar_atendimento_service, listar_atendimentos_service, resumo_atendimentos_service, alterar_status_atendimento_service, transferir_atendimento_service, dar_alta_atendimento_service

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
      busca: str | None = None,
      status: StatusAtendimento | None = None,
      setor_id: int | None = None,
      aberto: bool | None = None,
      db: Session = Depends(get_db)
    ):

    return listar_atendimentos_service(
        db=db,
        busca=busca,
        status=status,
        setor_id=setor_id,
        aberto=aberto
    )


@router.get("/resumo", response_model=ResumoAtendimentos)
def resumo_atendimento(db: Session = Depends(get_db)):
    return resumo_atendimentos_service(db=db)


@router.patch("/{atendimento_id}/status", response_model=RespostaAtendimento)
def alterar_status_atendimento(atendimento_id: int, dados: AlterarStatusAtendimento, db: Session = Depends(get_db)):
    return alterar_status_atendimento_service(
        db=db,
        atendimento_id=atendimento_id,
        dados=dados
    )


@router.patch("/{atendimento_id}/transferencia", response_model=RespostaAtendimento)
def transferir_atendimento(atendimento_id: int, dados: TransferirAtendimento, db: Session = Depends(get_db)):
    return transferir_atendimento_service(
        db=db,
        atendimento_id=atendimento_id,
        dados=dados
    )


@router.patch("/{atendimento_id}/alta", response_model=RespostaAtendimento)
def dar_alta_atendimento(atendimento_id: int, db: Session = Depends(get_db)):
    return dar_alta_atendimento_service(
        db=db,
        atendimento_id=atendimento_id
    )
