from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from schemas.leito import CriarLeito, RespostaLeito, AtualizarLeito, AlterarSituacaoLeito, StatusLeito, ResumoLeitos
from services.leito_service import criar_leito_service, listar_leitos_service, atualizar_leito_service, alterar_situacao_leito_service, resumo_leitos_service
from database import get_db

router = APIRouter(
    prefix="/leitos",
    tags=["Leitos"]
)

@router.post("/", status_code=201, response_model=RespostaLeito)
def criar_leito(dados: CriarLeito, db: Session = Depends(get_db)):

    novo_leito = criar_leito_service(
        db=db,
        dados=dados
    )

    return novo_leito


@router.get("/", response_model=list[RespostaLeito])
def listar_leitos(
    busca: str | None = None, 
    setor_id: int | None = None,
    status: StatusLeito | None = None,
    ativo: bool | None = None,
    db: Session = Depends(get_db)
    ):
    
    leitos = listar_leitos_service(
        db=db,
        busca=busca,
        setor_id=setor_id,
        status=status,
        ativo=ativo
    )

    return leitos


@router.patch("/{leito_id}", response_model=RespostaLeito)
def atualizar_leito(leito_id: int, dados: AtualizarLeito, db: Session = Depends(get_db)):

    leito_atualizado = atualizar_leito_service(
        db=db,
        leito_id=leito_id,
        dados=dados
    )

    return leito_atualizado


@router.patch("/{leito_id}/situacao", response_model=RespostaLeito)
def alterar_situacao_leito(leito_id: int, dados: AlterarSituacaoLeito, db: Session = Depends(get_db)):
    nova_situacao_leito = alterar_situacao_leito_service(
        db=db,
        leito_id=leito_id,
        ativo=dados.ativo
    )

    return nova_situacao_leito


@router.get("/resumo", response_model=ResumoLeitos)
def resumo_leitos(db: Session = Depends(get_db)):
    return resumo_leitos_service(db)


