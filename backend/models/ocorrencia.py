from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum
from database import Base
from datetime import datetime, timezone


class PrioridadeOcorrencia(str, Enum):
    baixa = "baixa"
    media = "media"
    alta = "alta"
    critica = "critica"

class StatusOcorrencia(str, Enum):
    aberta = "aberta"
    em_resolucao = "em_resolucao"
    resolvida = "resolvida"


class OcorrenciaDB(Base):
    __tablename__ = "ocorrencias"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    titulo: Mapped[str] = mapped_column(String(120))

    descricao: Mapped[str] = mapped_column(Text)

    prioridade: Mapped[PrioridadeOcorrencia] = mapped_column(
        SQLEnum(
            PrioridadeOcorrencia,
            name="prioridade_ocorrencia"
        )
    )

    status: Mapped[StatusOcorrencia] = mapped_column(
        SQLEnum(
            StatusOcorrencia,
            name="status_ocorrencia"
        ),
        default=StatusOcorrencia.aberta
    )

    setor_id: Mapped[int] = mapped_column(
        ForeignKey("setores.id")
    )

    criado_por_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id")
    )

    responsavel_id: Mapped[int | None] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=True
    )

    data_abertura: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    data_inicio_resolucao: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    data_resolucao: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    descricao_resolucao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    setor = relationship("SetorDB")

    criado_por = relationship(
        "UsuarioDB",
        foreign_keys=[criado_por_id]
    )

    responsavel = relationship(
        "UsuarioDB",
        foreign_keys=[responsavel_id]
    )