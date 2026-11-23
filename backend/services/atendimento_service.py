from datetime import datetime, timezone
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session, selectinload
from schemas.atendimento import CriarAtendimento, AlterarStatusAtendimento, TransferirAtendimento
from models.atendimento import AtendimentoDB, StatusAtendimento
from models.paciente import PacienteDB
from models.setor import SetorDB
from models.leito import LeitoDB, StatusLeito
from exceptions import PacienteNaoExiste, PacienteInativo, AtendimentoAtivoJaExiste, SetorNaoEncontrado, SetorInativo, LeitoNaoEncontrado, LeitoInativo, LeitoIndisponivel, LeitoNaoPertenceAoSetor, AtendimentoNaoEncontrado, AtendimentoEncerrado


def criar_atendimento_service(
    db: Session,
    dados: CriarAtendimento
):

    # 1. PACIENTE EXISTE?
    paciente = db.get(PacienteDB,dados.paciente_id)

    if not paciente:
        raise PacienteNaoExiste()


    # 2. PACIENTE ESTÁ ATIVO?
    if not paciente.ativo:
        raise PacienteInativo()


    # 3. JÁ POSSUI ATENDIMENTO ABERTO?
    comando = select(AtendimentoDB).where(
        AtendimentoDB.paciente_id == dados.paciente_id,
        AtendimentoDB.data_saida.is_(None)
    )

    atendimento_existente = db.scalar(comando)

    if atendimento_existente:
        raise AtendimentoAtivoJaExiste()


    # SEM SETOR E LEITO
    setor = None
    leito = None

    setor_id_final = dados.setor_id


    # 4. SETOR FOI INFORMADO?
    if dados.setor_id is not None:

        setor = db.get(SetorDB, dados.setor_id)

        if not setor:
            raise SetorNaoEncontrado()

        if not setor.ativo:
            raise SetorInativo()


    # 5. LEITO FOI INFORMADO?
    if dados.leito_id is not None:

        leito = db.get(LeitoDB, dados.leito_id)

        if not leito:
            raise LeitoNaoEncontrado()

        if not leito.ativo:
            raise LeitoInativo()

        if leito.status != StatusLeito.disponivel:
            raise LeitoIndisponivel()


        # 6. SE INFORMOU SETOR E LEITO
        if (dados.setor_id is not None and leito.setor_id != dados.setor_id):
            raise LeitoNaoPertenceAoSetor()


        # 7. INFORMOU LEITO MAS NÃO SETOR?
        if setor_id_final is None:
            setor_id_final = leito.setor_id

            setor = db.get(SetorDB, leito.setor_id)

            if not setor:
                raise SetorNaoEncontrado()

            if not setor.ativo:
                raise SetorInativo()


    # 8. CRIA O ATENDIMENTO
    novo_atendimento = AtendimentoDB(
        paciente_id=dados.paciente_id,
        setor_id=setor_id_final,
        leito_id=dados.leito_id
    )


    # 9. SE TEM LEITO, OCUPA
    if leito is not None:
        leito.status = StatusLeito.ocupado


    db.add(novo_atendimento)

    db.commit()

    db.refresh(novo_atendimento)

    return novo_atendimento


def listar_atendimentos_service(
        db: Session, 
        busca: str | None = None,
        status: StatusAtendimento | None = None, 
        setor_id: int | None = None,
        aberto: bool | None = None
    ):

    comando = (
        select(AtendimentoDB)
        .options(
            selectinload(AtendimentoDB.paciente),
            selectinload(AtendimentoDB.setor),
            selectinload(AtendimentoDB.leito)
        )
    )
    
    if busca:
        comando = comando.join(
            AtendimentoDB.paciente
        ).where(
            or_(
                PacienteDB.nome.ilike(f"%{busca}%"),
                PacienteDB.cpf.ilike(f"%{busca}%")
            )
        )


    if status is not None:
        comando = comando.where(
            AtendimentoDB.status == status
        )


    if setor_id is not None:
        comando = comando.where(
            AtendimentoDB.setor_id == setor_id
        )


    if aberto is not None:

        if aberto:
            comando = comando.where(
                AtendimentoDB.data_saida.is_(None)
            )

        else:
            comando = comando.where(
                AtendimentoDB.data_saida.is_not(None)
            )


    comando = comando.order_by(
        AtendimentoDB.data_entrada.desc()
    )


    return db.scalars(comando).all()


def resumo_atendimentos_service(db: Session):
    comando = select(

        func.count(AtendimentoDB.id)
        .label("total"),


        func.count(AtendimentoDB.id)
        .filter(
            AtendimentoDB.status ==
            StatusAtendimento.em_atendimento
        )
        .label("em_atendimento"),


        func.count(AtendimentoDB.id)
        .filter(
            AtendimentoDB.status ==
            StatusAtendimento.observacao
        )
        .label("observacao"),


        func.count(AtendimentoDB.id)
        .filter(
            AtendimentoDB.status ==
            StatusAtendimento.internado
        )
        .label("internados"),


        func.count(AtendimentoDB.id)
        .filter(
            AtendimentoDB.status ==
            StatusAtendimento.alta
        )
        .label("altas")
    )


    return db.execute(
        comando
    ).mappings().one()


def alterar_status_atendimento_service(
    db: Session,
    atendimento_id: int,
    dados: AlterarStatusAtendimento
):

    atendimento = db.get(AtendimentoDB, atendimento_id)

    if not atendimento:
        raise AtendimentoNaoEncontrado()

    if atendimento.data_saida is not None:
        raise AtendimentoEncerrado()

    atendimento.status = StatusAtendimento(dados.status)

    db.commit()

    db.refresh(atendimento)

    return atendimento


def transferir_atendimento_service(
    db: Session,
    atendimento_id: int,
    dados: TransferirAtendimento
):

    # 1. ATENDIMENTO EXISTE E ESTÁ ABERTO?
    atendimento = db.get(AtendimentoDB, atendimento_id)

    if not atendimento:
        raise AtendimentoNaoEncontrado()

    if atendimento.data_saida is not None:
        raise AtendimentoEncerrado()


    # 2. NOVO SETOR
    setor = db.get(SetorDB, dados.setor_id)

    if not setor:
        raise SetorNaoEncontrado()

    if not setor.ativo:
        raise SetorInativo()


    # 3. NOVO LEITO
    novo_leito = None

    if dados.leito_id is not None:

        novo_leito = db.get(LeitoDB, dados.leito_id)

        if not novo_leito:
            raise LeitoNaoEncontrado()

        if not novo_leito.ativo:
            raise LeitoInativo()

        if novo_leito.status != StatusLeito.disponivel:
            raise LeitoIndisponivel()

        if novo_leito.setor_id != dados.setor_id:
            raise LeitoNaoPertenceAoSetor()


    # 4. LIBERA O LEITO ANTERIOR
    if atendimento.leito_id is not None:
        leito_anterior = db.get(LeitoDB, atendimento.leito_id)
        leito_anterior.status = StatusLeito.higienizacao


    # 5. OCUPA O NOVO LEITO
    if novo_leito is not None:
        novo_leito.status = StatusLeito.ocupado


    # 6. ATUALIZA O ATENDIMENTO
    atendimento.setor_id = dados.setor_id
    atendimento.leito_id = dados.leito_id

    db.commit()

    db.refresh(atendimento)

    return atendimento


def dar_alta_atendimento_service(
    db: Session,
    atendimento_id: int
):

    atendimento = db.get(AtendimentoDB, atendimento_id)

    if not atendimento:
        raise AtendimentoNaoEncontrado()

    if atendimento.data_saida is not None:
        raise AtendimentoEncerrado()

    atendimento.status = StatusAtendimento.alta
    atendimento.data_saida = datetime.now(timezone.utc)

    if atendimento.leito_id is not None:
        leito = db.get(LeitoDB, atendimento.leito_id)
        leito.status = StatusLeito.higienizacao

    db.commit()

    db.refresh(atendimento)

    return atendimento


