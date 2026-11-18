from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import date

class CriarPaciente(BaseModel):
    nome: str = Field(min_length=3, max_length=120)
    cpf: str = Field(min_length=11, max_length=11, pattern=r"^\d{11}$")
    data_nascimento: date

    @field_validator("data_nascimento")
    @classmethod
    def validar_data_nascimento(cls, valor: date):
        if valor > date.today():
            raise ValueError(
                "Data de nascimento não pode estar no futuro"
            )

        return valor


class RespostaPaciente(BaseModel):
    id: int
    nome: str
    cpf: str
    data_nascimento: date
    ativo: bool

    model_config = ConfigDict(from_attributes=True)


class AtualizarPaciente(BaseModel):
    nome: str | None = Field(default=None, min_length=3, max_length=120)
    cpf: str  | None = Field(default=None, min_length=11, max_length=11, pattern=r"^\d{11}$")
    data_nascimento: date | None = Field(default=None)

    @field_validator("data_nascimento")
    @classmethod
    def validar_data_nascimento(cls, valor: date | None):
        if valor is not None and valor > date.today():
            raise ValueError(
                "Data de nascimento não pode estar no futuro"
            )

        return valor


class AlterarSituacaoPaciente(BaseModel):
    ativo: bool
