from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
import jwt
from config import settings

password_hash = PasswordHash.recommended()

def gerar_senha_hash(senha: str) -> str:
    return password_hash.hash(senha)


def verificar_senha(senha: str, senha_hash: str) -> bool:
    return password_hash.verify(
        senha,
        senha_hash
    )


def criar_token_acesso(usuario_id: int) -> str:
    expiracao = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    dados_token = {
        "sub": str(usuario_id),
        "exp": expiracao
    }

    token = jwt.encode(
        dados_token,
        settings.secret_key,
        algorithm=settings.algorithm
    )

    return token