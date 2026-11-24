from pydantic import BaseModel, ConfigDict
from models.atendimento import StatusAtendimento

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