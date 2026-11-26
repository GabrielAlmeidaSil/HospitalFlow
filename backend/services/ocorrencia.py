from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, selectinload
from schemas.ocorrencia import CriarOcorrencia, ResolverOcorrencia, ResumoOcorrencia
from models.ocorrencia import OcorrenciaDB, StatusOcorrencia, PrioridadeOcorrencia
from models.setor import SetorDB
from exceptions import SetorInativo, SetorNaoEncontrado, OcorrenciaNaoEncontrada, OcorrenciaNaoEstaAberta, OcorrenciaNaoEstaEmResolucao, UsuarioNaoResponsavelPelaOcorrencia
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

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


def assumir_ocorrencia_service(db: Session, ocorrencia_id: int, usuario_id: int):
    comando = (
        select(OcorrenciaDB).where(
            OcorrenciaDB.id == ocorrencia_id
        ).with_for_update()
    )

    ocorrencia = db.scalar(comando)

    if not ocorrencia:
        raise OcorrenciaNaoEncontrada()

    if ocorrencia.status != StatusOcorrencia.aberta:
        raise OcorrenciaNaoEstaAberta()

    ocorrencia.status = StatusOcorrencia.em_resolucao

    ocorrencia.responsavel_id = usuario_id

    ocorrencia.data_inicio_resolucao = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ocorrencia)

    return ocorrencia


def resolver_ocorrencia_service(db: Session, ocorrencia_id: int, dados: ResolverOcorrencia, usuario_id: int):
    comando = (
        select(OcorrenciaDB).where(
            OcorrenciaDB.id == ocorrencia_id
        ).with_for_update()
    )

    ocorrencia = db.scalar(comando)

    if not ocorrencia:
        raise OcorrenciaNaoEncontrada()

    if ocorrencia.status != StatusOcorrencia.em_resolucao:
        raise OcorrenciaNaoEstaEmResolucao()

    if ocorrencia.responsavel_id != usuario_id:
        raise UsuarioNaoResponsavelPelaOcorrencia()

    ocorrencia.status = StatusOcorrencia.resolvida

    ocorrencia.descricao_resolucao = dados.descricao_resolucao

    ocorrencia.data_resolucao = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ocorrencia)

    return ocorrencia
    

def resumo_ocorrencia_service(db: Session):
    fuso_horario = ZoneInfo("America/Sao_Paulo")

    agora = datetime.now(fuso_horario)

    inicio_hoje = agora.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    inicio_amanha = inicio_hoje + timedelta(days=1)

    comando = select (
        func.count(OcorrenciaDB.id).filter(
            OcorrenciaDB.status == StatusOcorrencia.aberta
        ).label("abertas"),

        func.count(OcorrenciaDB.id).filter(
            OcorrenciaDB.status == StatusOcorrencia.em_resolucao
        ).label("em_resolucao"),

        func.count(OcorrenciaDB.id).filter(
            OcorrenciaDB.status == StatusOcorrencia.resolvida,
            OcorrenciaDB.data_resolucao >= inicio_hoje,
            OcorrenciaDB.data_resolucao < inicio_amanha
        ).label("resolvidas_hoje"),

        func.count(OcorrenciaDB.id).filter(
            OcorrenciaDB.prioridade == PrioridadeOcorrencia.critica,
            OcorrenciaDB.status != StatusOcorrencia.resolvida 
        ).label("criticas_pendentes")
    )

    resultado = db.execute(comando).mappings().one()

    return resultado
