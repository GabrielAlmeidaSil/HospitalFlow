from sqlalchemy import select, func
from sqlalchemy.orm import Session
from schemas.ocorrencia import CriarOcorrencia
from models.ocorrencia import OcorrenciaDB
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

    

    

