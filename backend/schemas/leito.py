from pydantic import BaseModel, Field, ConfigDict
from models.leito import StatusLeito

class CriarLeito(BaseModel):
    codigo: str = Field(min_length=2, max_length=10)
    status: StatusLeito = StatusLeito.disponivel
    setor_id: int = Field(gt=0)

class RespostaLeito(BaseModel):
    id: int
    codigo: str
    status: str
    ativo: bool
    setor_id: int

    model_config = ConfigDict(from_attributes=True)