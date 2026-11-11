from sqlalchemy import select
from sqlalchemy.orm import Session

from schemas.usuario import CriarUsuario, LoginUsuario
from models.usuario import UsuarioDB
from security import gerar_senha_hash, verificar_senha
from exceptions import EmailJaCadastrado, EmailOuSenhaInvalido

def criar_usuario_service(db: Session, dados: CriarUsuario):
    comando = select(UsuarioDB).where(
        UsuarioDB.email == dados.email
    )

    email_existente = db.scalar(comando)

    if email_existente:
        raise EmailJaCadastrado()

    senha_hash = gerar_senha_hash(
        dados.senha
    )

    novo_usuario = UsuarioDB(
        nome=dados.nome,
        email=dados.email,
        senha_hash=senha_hash
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario


def autenticar_usuario_service(db: Session, dados: LoginUsuario):
    comando = select(UsuarioDB).where(
        UsuarioDB.email == dados.email
    )

    usuario = db.scalar(comando)

    if not usuario:
        raise EmailOuSenhaInvalido()

    senha_correta = verificar_senha(
        senha=dados.senha,
        senha_hash=usuario.senha_hash
    )

    if not senha_correta:
        raise EmailOuSenhaInvalido()

    return usuario