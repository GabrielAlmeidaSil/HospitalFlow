from sqlalchemy import select
from sqlalchemy.orm import Session
from schemas.setor import CriarSetor
from models.setor import SetorDB
from exceptions import SetorJaExiste

def criar_setor_service(db: Session, dados: CriarSetor):
    comando = select(SetorDB).where(
        SetorDB.nome == dados.nome
    )

    setor_existe = db.scalar(comando)

    if setor_existe:
        raise SetorJaExiste()

    novo_setor = SetorDB(
        nome=dados.nome
    )

    db.add(novo_setor)
    db.commit()
    db.refresh(novo_setor)

    return novo_setor


def listar_setores_service(db: Session):
    comando = select(SetorDB)

    lista_setores = db.scalars(comando).all()

    return lista_setores
