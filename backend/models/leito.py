from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy import Enum as SQLEnum
from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class StatusLeito(str, Enum):
    disponivel = "disponivel"
    ocupado = "ocupado"
    higienizacao = "higienizacao"
    manutencao = "manutencao"

class LeitoDB(Base):
    __tablename__ = "leitos"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    codigo: Mapped[str] = mapped_column(
        String(10),
        unique=True
    )

    status: Mapped[StatusLeito] = mapped_column(
        SQLEnum(
            StatusLeito,
            name="status_leito"
        ),
        default=StatusLeito.disponivel
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    setor_id: Mapped[int] = mapped_column(
        ForeignKey("setores.id")
    )

    setor: Mapped["SetorDB"] = relationship(
        "SetorDB",
        back_populates="leitos"
    )