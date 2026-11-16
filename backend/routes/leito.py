from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from models.leito import LeitoDB
from schemas.leito import CriarLeito, RespostaLeito
from services.leito_service import criar_leito_service, listar_leitos_service
from database import get_db

router = APIRouter(
    prefix="/leitos",
    tags=["Leitos"]
)

@router.post("/", status_code=201, response_model=RespostaLeito)
def criar_leito(dados: CriarLeito, db: Session = Depends(get_db)):

    novo_leito = criar_leito_service(
        db=db,
        dados=dados
    )

    return novo_leito


@router.get("/", response_model=list[RespostaLeito])
def listar_leitos(db: Session = Depends(get_db)):

    listar_leitos = listar_leitos_service(
        db=db
    )

    return listar_leitos



