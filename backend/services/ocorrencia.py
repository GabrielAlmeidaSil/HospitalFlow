from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, selectinload
from schemas.ocorrencia import CriarOcorrencia
from models.ocorrencia import OcorrenciaDB, StatusOcorrencia, PrioridadeOcorrencia
from models.setor import SetorDB
from exceptions import SetorInativo, SetorNaoEncontrado

def criar_ocorrencia_service(db: Session, dados: CriarOcorrencia, usuario_id: int):
    setor = db.get(SetorDB, dados.setor_id)

    if not setor:
        raise SetorNaoEncontrado()

    if not setor.ativo:
        raise SetorInativo()

    nova_ocorrencia = OcorrenciaDB(
        titulo=dados.titulo,
        descricao=dados.descricao,
        prioridade=dados.prioridade,
        setor_id=dados.setor_id,
        criado_por_id=usuario_id
    )

    db.add(nova_ocorrencia)
    db.commit()
    db.refresh(nova_ocorrencia)

    return nova_ocorrencia


def listar_ocorrencia_service(
        db: Session,
        busca: str | None = None,
        setor_id: int | None = None,
        prioridade: PrioridadeOcorrencia | None = None,
        status: StatusOcorrencia | None = None
    ):

    comando = (
        select(OcorrenciaDB)
        .options(
            selectinload(OcorrenciaDB.setor),
            selectinload(OcorrenciaDB.criado_por),
            selectinload(OcorrenciaDB.responsavel)
        )
    )

    if busca: 
        comando = comando.where(
            or_(
                OcorrenciaDB.titulo.ilike(f"%{busca}%"),
                OcorrenciaDB.descricao.ilike(f"%{busca}%")
            )
        )

    if setor_id is not None:
        comando = comando.where(
            OcorrenciaDB.setor_id == setor_id
        )

    if prioridade is not None:
        comando = comando.where(
            OcorrenciaDB.prioridade == prioridade
        )

    if status is not None:
        comando = comando.where(
            OcorrenciaDB.status == status
        )

    comando = comando.order_by(
        OcorrenciaDB.data_abertura.desc(),
        OcorrenciaDB.id.desc()
    )

    return db.scalars(comando).all()

    

    

