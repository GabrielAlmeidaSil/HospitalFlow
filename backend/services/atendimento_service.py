from sqlalchemy import select
from sqlalchemy.orm import Session
from schemas.atendimento import CriarAtendimento
from models.atendimento import AtendimentoDB, StatusAtendimento
from models.paciente import PacienteDB
from models.setor import SetorDB
from models.leito import LeitoDB, StatusLeito
from exceptions import PacienteNaoExiste, PacienteInativo, AtendimentoAtivoJaExiste, SetorNaoEncontrado, SetorInativo, LeitoNaoEncontrado, LeitoInativo, LeitoIndisponivel, LeitoNaoPertenceAoSetor


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


def listar_atendimento_service(
        db: Session, 
        status: StatusAtendimento | None = None, 
        paciente_id: int | None = None,
        setor_id: int | None = None,
        aberto: bool | None = None
    ):

    comando = select(AtendimentoDB)

    if status is not None:
        comando = comando.where(
            AtendimentoDB.status == status
        )

    if paciente_id is not None:
        comando = comando.where(
            AtendimentoDB.paciente_id == paciente_id
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