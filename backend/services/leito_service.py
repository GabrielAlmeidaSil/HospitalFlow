from sqlalchemy import select, func
from sqlalchemy.orm import Session
from schemas.leito import CriarLeito, AtualizarLeito
from models.leito import LeitoDB, StatusLeito
from models.setor import SetorDB
from exceptions import CodigoLeitoJaExiste, SetorNaoEncontrado, SetorInativo, LeitoNaoEncontrado, LeitoOcupado

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
        setor_id=dados.setor_id
    )

    db.add(novo_leito)
    db.commit()
    db.refresh(novo_leito)

    return novo_leito


def listar_leitos_service(
        db: Session,
        busca: str | None = None,
        setor_id: int | None = None,
        status: StatusLeito | None = None,
        ativo: bool | None = None
    ):

    comando = select(LeitoDB)

    if busca:
        comando = comando.where(
            LeitoDB.codigo.ilike(
                f"%{busca}%"
            )
        )

    if setor_id is not None:
        comando = comando.where(
            LeitoDB.setor_id == setor_id
        )

    if status is not None:
        comando = comando.where(
            LeitoDB.status == status
        )

    if ativo is not None:
        comando = comando.where(
            LeitoDB.ativo == ativo
        )

    lista_leitos = db.scalars(comando).all()

    return lista_leitos


def atualizar_leito_service(db: Session, leito_id: int, dados: AtualizarLeito):
    leito = db.get(LeitoDB, leito_id)

    if not leito:
        raise LeitoNaoEncontrado()

    leito_atualizacao = dados.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    if "setor_id" in leito_atualizacao:
        setor = db.get(SetorDB, leito_atualizacao["setor_id"])

        if not setor:
            raise SetorNaoEncontrado()

        if not setor.ativo:
            raise SetorInativo()

    if "codigo" in leito_atualizacao:
        comando = select(LeitoDB).where(
            LeitoDB.codigo == leito_atualizacao["codigo"],
            LeitoDB.id != leito_id
        )

        codigo_existente = db.scalar(comando)

        if codigo_existente:
            raise CodigoLeitoJaExiste()

    for campo, valor in leito_atualizacao.items():
        setattr(leito, campo, valor)

    db.commit()
    db.refresh(leito)

    return leito


def alterar_situacao_leito_service(db: Session, leito_id: int, ativo: bool):
    leito = db.get(LeitoDB, leito_id)

    if not leito:
        raise LeitoNaoEncontrado()

    if not ativo and leito.status == StatusLeito.ocupado:
        raise LeitoOcupado()

    leito.ativo = ativo

    db.commit()
    db.refresh(leito)

    return leito


def resumo_leitos_service(db: Session):
    comando = select(
        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True)
        )
        .label("total"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.disponivel
        )
        .label("disponiveis"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.ocupado
        )
        .label("ocupados"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.higienizacao
        )
        .label("higienizacao"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.manutencao
        )
        .label("manutencao")
    )

    resultado = db.execute(
        comando
    ).mappings().one()

    return resultado