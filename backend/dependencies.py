from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from database import get_db
from exceptions import TokenInvalido
from models.usuario import UsuarioDB
from security import decodificar_token


bearer_scheme = HTTPBearer()

def get_current_user(
        credenciais: HTTPAuthorizationCredentials = Depends(bearer_scheme),
        db: Session = Depends(get_db)
):
    token = credenciais.credentials

    dados = decodificar_token(token)

    usuario_id = dados.get("sub")

    if not usuario_id:
        raise TokenInvalido()

    try:
        usuario_id = int(usuario_id)
    except ValueError:
        raise TokenInvalido()

    usuario = db.get(
        UsuarioDB,
        usuario_id
    )

    if not usuario:
        raise TokenInvalido

    return usuario