from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.usuario import LoginUsuario, RespostaLogin
from services.usuario_service import autenticar_usuario_service
from security import criar_token_acesso

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


@router.post("/login", response_model=RespostaLogin)
def autenticar_usuario(dados: LoginUsuario, db: Session = Depends(get_db)):

    usuario_logado = autenticar_usuario_service(
        db=db,
        dados=dados
    )

    token = criar_token_acesso(
        usuario_id=usuario_logado.id
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }