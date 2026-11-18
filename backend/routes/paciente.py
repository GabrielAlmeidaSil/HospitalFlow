from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.pacientes import CriarPaciente, RespostaPaciente, AtualizarPaciente, AlterarSituacaoPaciente
from services.paciente_service import criar_paciente_service, listar_pacientes_service, atualizar_paciente_service, alterar_situacao_paciente_service


router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)


@router.post("/", status_code=201, response_model=RespostaPaciente)
def criar_paciente(dados: CriarPaciente, db: Session = Depends(get_db)):
    return criar_paciente_service(
        db=db,
        dados=dados
    )


@router.get("/", response_model=list[RespostaPaciente])
def listar_pacientes(busca: str | None = None, ativo: bool | None = None, db: Session = Depends(get_db)):
    return listar_pacientes_service(
        db=db,
        busca=busca,
        ativo=ativo
    )


@router.patch("/{paciente_id}", response_model=RespostaPaciente)
def atualizar_paciente(paciente_id: int, dados: AtualizarPaciente, db: Session = Depends(get_db)):
    return atualizar_paciente_service(
        db=db,
        paciente_id=paciente_id,
        dados=dados
    )


@router.patch("/{paciente_id}/situacao", response_model=RespostaPaciente)
def atualizar_situacao_paciente(paciente_id: int, dados: AlterarSituacaoPaciente, db: Session = Depends(get_db)):
    return alterar_situacao_paciente_service(
        db=db,
        paciente_id=paciente_id,
        ativo=dados.ativo
    )

