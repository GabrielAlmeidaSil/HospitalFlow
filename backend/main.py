from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db

app = FastAPI(
    title="HospitalFlow API",
    description="APIs referente aos processos do HospitalFlow",
    version="1.0"
)