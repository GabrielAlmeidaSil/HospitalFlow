from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from models.ocorrencia import PrioridadeOcorrencia, StatusOcorrencia


class CriarOcorrencia(BaseModel):
    titulo: str = Field(min_length=5, max_length=120)
    descricao: str = Field(min_length=10, max_length=2000)
    prioridade: PrioridadeOcorrencia
    setor_id: int = Field(gt=0)

    model_config = ConfigDict(from_attributes=True)


class SetorResumoOcorrencia(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)


class UsuarioResumoOcorrencia(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)


class RespostaOcorrencia(BaseModel):
    id: int
    titulo: str
    descricao: str
    prioridade: PrioridadeOcorrencia
    status: StatusOcorrencia
    setor: SetorResumoOcorrencia
    criado_por: UsuarioResumoOcorrencia
    responsavel: UsuarioResumoOcorrencia | None
    data_abertura: datetime
    data_inicio_resolucao: datetime | None
    data_resolucao: datetime | None
    descricao_resolucao: str | None

    model_config = ConfigDict(from_attributes=True)


class ResolverOcorrencia(BaseModel):
    descricao_resolucao: str = Field(min_length=10, max_length=2000)

    model_config = ConfigDict(from_attributes=True)
    