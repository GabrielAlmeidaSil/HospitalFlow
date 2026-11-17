from pydantic import BaseModel, Field, ConfigDict
from models.leito import StatusLeito

class CriarLeito(BaseModel):
    codigo: str = Field(min_length=2, max_length=10)
    setor_id: int = Field(gt=0)

class RespostaLeito(BaseModel):
    id: int
    codigo: str
    status: str
    ativo: bool
    setor_id: int
    setor: RespostaSetorResumo

    model_config = ConfigDict(from_attributes=True)


class RespostaSetorResumo(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)


class AtualizarLeito(BaseModel):
    codigo: str | None = Field(default=None, min_length=2, max_length=10)
    setor_id: int | None = Field(default=None, gt=0)


class AlterarSituacaoLeito(BaseModel):
    ativo: bool