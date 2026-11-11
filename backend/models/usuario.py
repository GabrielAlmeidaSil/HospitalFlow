from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class UsuarioDB(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    nome: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        index=True
    )

    senha_hash: Mapped[str] = mapped_column(
        String(255)
    )

    funcao: Mapped[str] = mapped_column(
        String(20), 
        default="operador",
        server_default="operador"
    )