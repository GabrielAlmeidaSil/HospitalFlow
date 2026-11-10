from fastapi import FastAPI

app = FastAPI(
    title="HospitalFlow API",
    description="APIs referente aos processos do HospitalFlow",
    version="1.0"
)

@app.get("/")
def home():
    return {"mensagem": "Api HospitalFlow funcionando"}