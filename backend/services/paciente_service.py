from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from schemas.pacientes import CriarPaciente, AtualizarPaciente
from models.paciente import PacienteDB
from exceptions import CpfPacienteJaExiste, PacienteNaoExiste


def criar_paciente_service(db: Session, dados: CriarPaciente):
    comando = select(PacienteDB).where(
        PacienteDB.cpf == dados.cpf
    )

    cpf_existe = db.scalar(comando)

    if cpf_existe:
        raise CpfPacienteJaExiste()

    novo_paciente = PacienteDB(
        nome=dados.nome,
        cpf=dados.cpf,
        data_nascimento=dados.data_nascimento
    )

    db.add(novo_paciente)
    db.commit()
    db.refresh(novo_paciente)

    return novo_paciente


def listar_pacientes_service(db: Session, busca: str | None = None, ativo: bool | None = None):
    comando = select(PacienteDB)

    if busca:
        comando = comando.where(
            or_(
                PacienteDB.nome.ilike(
                    f"%{busca}%"
                ),
                PacienteDB.cpf.ilike(
                    f"%{busca}%"
                )
            )
        )

    if ativo is not None:
        comando = comando.where(
            PacienteDB.ativo == ativo
        )

    lista_de_pacientes = db.scalars(comando).all()

    return lista_de_pacientes


def atualizar_paciente_service(db: Session, paciente_id: int, dados: AtualizarPaciente):
    paciente = db.get(PacienteDB, paciente_id)

    if not paciente:
        raise PacienteNaoExiste()

    paciente_atualizacao = dados.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if "cpf" in paciente_atualizacao:
        comando = select(PacienteDB).where(
            PacienteDB.cpf == paciente_atualizacao["cpf"],
            PacienteDB.id != paciente_id
        )

        cpf_existe = db.scalar(comando)

        if cpf_existe:
            raise CpfPacienteJaExiste()


    for campo, valor in paciente_atualizacao.items():
        setattr(paciente, campo, valor)

    db.commit()
    db.refresh(paciente)

    return paciente


def alterar_situacao_paciente_service(db: Session, paciente_id: int, ativo: bool):
    paciente = db.get(PacienteDB, paciente_id)

    if not paciente:
        raise PacienteNaoExiste()

    paciente.ativo = ativo

    db.commit()
    db.refresh(paciente)

    return paciente


def resumo_pacientes_service(db: Session): 
    comando = select(
        func.count(PacienteDB.id).label("total"),

        func.count(PacienteDB.id)
        .filter(PacienteDB.ativo.is_(True))
        .label("ativos"),

        func.count(PacienteDB.id)
        .filter(PacienteDB.ativo.is_(False))
        .label("inativos")
    )

    return db.execute(comando).mappings().one()