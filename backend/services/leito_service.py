from sqlalchemy import select
from sqlalchemy.orm import Session
from schemas.leito import CriarLeito, RespostaLeito
from models.leito import LeitoDB
from models.setor import SetorDB
from exceptions import CodigoLeitoJaExiste, SetorNaoEncontrado, SetorInativo

def criar_leito_service(db: Session, dados: CriarLeito):
    comando = select(LeitoDB).where(
        LeitoDB.codigo == dados.codigo
    )

    codigo_leito_existe = db.scalar(comando)

    if codigo_leito_existe:
        raise CodigoLeitoJaExiste()

    setor = db.get(SetorDB, dados.setor_id)

    if not setor: 
        raise SetorNaoEncontrado()

    if not setor.ativo:
        raise SetorInativo()

    novo_leito = LeitoDB(
        codigo=dados.codigo,
        status=dados.status,
        setor_id=dados.setor_id
    )

    db.add(novo_leito)
    db.commit()
    db.refresh(novo_leito)

    return novo_leito


def listar_leitos_service(db: Session):
    comando = select(LeitoDB)

    lista_leitos = db.scalars(comando).all()

    return lista_leitos