from pydantic import BaseModel

class ResumoDashboard(BaseModel):
    leitos_total: int
    leitos_ocupados: int
    leitos_disponiveis: int
    porcentagem_ocupacao: float
    pacientes_em_atendimento: int
    altas_hoje: int