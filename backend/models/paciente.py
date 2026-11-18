from sqlalchemy import String, Boolean, Date
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date
from database import Base

class PacienteDB(Base):
    __tablename__ = "pacientes"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    nome: Mapped[str] = mapped_column(
        String(120)
    )

    cpf: Mapped[str] = mapped_column(
        String(11),
        unique=True,
        index=True
    )

    data_nascimento: Mapped[date] = mapped_column(
        Date
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )