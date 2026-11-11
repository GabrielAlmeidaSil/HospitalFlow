from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.usuario import CriarUsuario, RespostaUsuario
from services.usuario_service import criar_usuario_service

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

@router.post("/", status_code=201, response_model=RespostaUsuario)
def criar_usuario(dados: CriarUsuario, db: Session = Depends(get_db)):
    novo_usuario = criar_usuario_service(
        db=db,
        dados=dados
    )

    return novo_usuario

