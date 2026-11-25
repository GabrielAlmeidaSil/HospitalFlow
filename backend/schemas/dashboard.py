from pydantic import BaseModel, ConfigDict
from models.atendimento import StatusAtendimento
from datetime import datetime

class ResumoDashboard(BaseModel):
    leitos_total: int
    leitos_ocupados: int
    leitos_disponiveis: int
    porcentagem_ocupacao: float
    pacientes_em_atendimento: int
    altas_hoje: int


class OcupacaoPorSetor(BaseModel):
    setor_id: int
    setor_nome: str
    leitos_total: int
    leitos_ocupados: int
    porcentagem_ocupacao: float

    model_config = ConfigDict(from_attributes=True)


class DistribuicaoAtendimentos(BaseModel):
    status: StatusAtendimento
    quantidade: int
    porcentagem_ocupacao: float

    model_config = ConfigDict(from_attributes=True)


class AtendimentosRecentes(BaseModel):
    id: int
    paciente_nome: str
    status: StatusAtendimento
    setor_nome: str | None
    leito_codigo: str | None
    data_entrada: datetime

    model_config = ConfigDict(from_attributes=True)
