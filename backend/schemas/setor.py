from pydantic import BaseModel, Field, ConfigDict

class CriarSetor(BaseModel):
    nome: str = Field(min_length=2, max_length=50)

class RespostaSetor(BaseModel):
    id: int
    nome: str
    ativo: bool

    model_config = ConfigDict(from_attributes=True)