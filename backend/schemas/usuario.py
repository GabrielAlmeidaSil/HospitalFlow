from pydantic import BaseModel, Field, EmailStr, ConfigDict

class CriarUsuario(BaseModel):
    nome: str = Field(min_length=3, max_length=100)
    email: EmailStr = Field(max_length=120)
    senha: str = Field(min_length=8, max_length=100)


class RespostaUsuario(BaseModel):
    id: int
    nome: str 
    email: str 
    funcao: str 

    model_config = ConfigDict(from_attributes=True)


class LoginUsuario(BaseModel):
    email: EmailStr
    senha: str


class RespostaLogin(BaseModel):
    access_token: str
    token_type: str