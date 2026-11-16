from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class SetorDB(Base):
    __tablename__ = "setores"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    nome: Mapped[str] = mapped_column(
        String(50)
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    leitos: Mapped[list["LeitoDB"]] = relationship(
        "LeitoDB",
        back_populates="setor"
    )