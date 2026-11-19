from sqlalchemy import ForeignKey, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from enum import Enum
from datetime import datetime, timezone

class StatusAtendimento(str, Enum):
    em_atendimento = "em_atendimento"
    observacao = "observacao"
    internado = "internado"
    alta = "alta"


class AtendimentoDB(Base):
    __tablename__ = "atendimentos"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    paciente_id: Mapped[int] = mapped_column(
        ForeignKey("pacientes.id")
    )

    status: Mapped[StatusAtendimento] = mapped_column(
        SQLEnum(
            StatusAtendimento,
            name="status_atendimento"
        ),
        default=StatusAtendimento.em_atendimento
    )

    setor_id: Mapped[int | None] = mapped_column(
        ForeignKey("setores.id"),
        nullable=True
    )

    leito_id: Mapped[int | None] = mapped_column(
        ForeignKey("leitos.id"),
        nullable=True
    )

    data_entrada: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    data_saida: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    paciente = relationship("PacienteDB")
    setor = relationship("SetorDB")
    leito = relationship("LeitoDB")