from pydantic import BaseModel, Field, ConfigDict
from models.atendimento import StatusAtendimento
from datetime import datetime
from typing import Literal

class CriarAtendimento(BaseModel):
    paciente_id: int = Field(gt=0)
    setor_id: int | None = Field(default=None, gt=0)
    leito_id: int | None = Field(default=None, gt=0)


class AlterarStatusAtendimento(BaseModel):
    status: Literal["em_atendimento", "observacao", "internado"]


class TransferirAtendimento(BaseModel):
    setor_id: int = Field(gt=0)
    leito_id: int | None = Field(default=None, gt=0)


class PacienteResumoAtendimento(BaseModel):
    id: int
    nome: str
    cpf: str

    model_config = ConfigDict(from_attributes=True)


class SetorResumoAtendimento(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)


class LeitoResumoAtendimento(BaseModel):
    id: int
    codigo: str

    model_config = ConfigDict(from_attributes=True)


class RespostaAtendimento(BaseModel):
    id: int
    paciente_id: int
    status: StatusAtendimento

    setor_id: int | None
    leito_id: int | None

    data_entrada: datetime
    data_saida: datetime | None

    paciente: PacienteResumoAtendimento
    setor: SetorResumoAtendimento | None
    leito: LeitoResumoAtendimento | None

    model_config = ConfigDict(from_attributes=True)


class ResumoAtendimentos(BaseModel):
    total: int
    em_atendimento: int
    observacao: int
    internados: int
    altas: int