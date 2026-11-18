from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from exceptions import (
    EmailJaCadastrado, 
    EmailOuSenhaInvalido, 
    TokenInvalido, 
    SetorJaExiste, 
    CodigoLeitoJaExiste, 
    SetorNaoEncontrado, 
    SetorInativo, 
    LeitoNaoEncontrado, 
    LeitoOcupado,
    CpfPacienteJaExiste,
    PacienteNaoExiste
)

from routes.usuario import router as usuario_router
from routes.auth import router as auth_router
from routes.setor import router as setor_router
from routes.leito import router as leito_router
from routes.paciente import router as paciente_router

app = FastAPI(
    title="HospitalFlow API",
    description="APIs referente aos processos do HospitalFlow",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200"
    ],
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],
    allow_headers=[
        "Content-Type",
        "Authorization"
    ]
)


@app.exception_handler(EmailJaCadastrado)
def email_ja_cadastrado_handler(request: Request, exc: EmailJaCadastrado):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Email ja cadastrado"
        }
    )

@app.exception_handler(EmailOuSenhaInvalido)
def credenciais_invalidas_handler(request: Request, exc: EmailOuSenhaInvalido):
    return JSONResponse(
        status_code=401,
        content={
            "detail": "Email ou senha inválidos"
        }
    )

@app.exception_handler(TokenInvalido)
def decodificar_token(request: Request, exc: TokenInvalido):
    return JSONResponse(
        status_code=401,
        content={
            "detail": "Token inválid"
        },
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

@app.exception_handler(SetorJaExiste)
def criar_setor(request: Request, exc: SetorJaExiste):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Setor já cadastrado"
        }
    )

@app.exception_handler(CodigoLeitoJaExiste)
def codigo_setor_existe(request: Request, exc: CodigoLeitoJaExiste):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Leito já cadastrado"
        }
    )

@app.exception_handler(SetorNaoEncontrado)
def setor_nao_encontrado(request: Request, exc: SetorNaoEncontrado):
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Setor não encontrado"
        }
    )

@app.exception_handler(SetorInativo)
def setor_inativo(request: Request, exc: SetorInativo):
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Não é possível cadastrar um setor inativo"
        }
    )

@app.exception_handler(LeitoNaoEncontrado)
def leito_nao_encontrado(request: Request, exc: LeitoNaoEncontrado):
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Leito não encontrado"
        }
    )

@app.exception_handler(LeitoOcupado)
def leito_ocupado_handler(request: Request, exc: LeitoOcupado):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Não é possível desativar um leito ocupado."
        }
    )

@app.exception_handler(CpfPacienteJaExiste)
def cpf_paciente_existe(request: Request, exc: CpfPacienteJaExiste):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "CPF já cadastrado"
        }
    )

@app.exception_handler(PacienteNaoExiste)
def paciente_nao_encontrado(request: Request, exc: PacienteNaoExiste):
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Paciete nao encontrado"
        }
    )



app.include_router(usuario_router)
app.include_router(auth_router)
app.include_router(setor_router)
app.include_router(leito_router)
app.include_router(paciente_router)