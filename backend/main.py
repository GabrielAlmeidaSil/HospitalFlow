from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from exceptions import EmailJaCadastrado, EmailOuSenhaInvalido
from routes.usuario import router as usuario_router
from routes.auth import router as auth_router

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



app.include_router(usuario_router)
app.include_router(auth_router)