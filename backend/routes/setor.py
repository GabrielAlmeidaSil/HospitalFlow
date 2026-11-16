from fastapi import APIRouter, Depends
from schemas.setor import CriarSetor, RespostaSetor
from sqlalchemy.orm import Session
from services.setor_service import criar_setor_service, listar_setores_service
from database import get_db

router = APIRouter(
    prefix="/setores",
    tags=["Setores"]
)

@router.post("/", status_code=201, response_model=RespostaSetor)
def criar_setor(dados: CriarSetor, db: Session = Depends(get_db)):
    novo_setor = criar_setor_service(
        db=db,
        dados=dados
    )

    return novo_setor


@router.get("/", response_model=list[RespostaSetor])
def listar_setores(db: Session = Depends(get_db)):

    lista_setores = listar_setores_service(
        db=db
    )

    return lista_setores