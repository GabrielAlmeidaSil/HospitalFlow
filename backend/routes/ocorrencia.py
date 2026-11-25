from fastapi import APIRouter, Depends
from schemas.ocorrencia import CriarOcorrencia, RespostaOcorrencia
from services.ocorrencia import criar_ocorrencia_service, listar_ocorrencia_service
from models.usuario import UsuarioDB
from dependencies import get_current_user
from sqlalchemy.orm import Session
from database import get_db
from models.ocorrencia import PrioridadeOcorrencia, StatusOcorrencia

router = APIRouter(
    prefix="/ocorrencias",
    tags=["Ocorrências"]
)

@router.post("/", status_code=201, response_model=RespostaOcorrencia)
def criar_ocorrencia(dados: CriarOcorrencia, db: Session = Depends(get_db), usuario_atual: UsuarioDB = Depends(get_current_user)):
    return criar_ocorrencia_service(
        db=db,
        dados=dados,
        usuario_id=usuario_atual.id
    )

@router.get("/", response_model=list[RespostaOcorrencia], dependencies=[Depends(get_current_user)])
def listar_ocorrencia(busca: str | None = None, setor_id: int | None = None, prioridade: PrioridadeOcorrencia | None = None, status: StatusOcorrencia | None = None, db: Session = Depends(get_db)):
    return listar_ocorrencia_service(
        db=db,
        busca=busca,
        setor_id=setor_id,
        prioridade=prioridade,
        status=status
    )