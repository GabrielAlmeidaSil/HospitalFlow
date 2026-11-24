from sqlalchemy import select, func
from sqlalchemy.orm import Session
from models.leito import LeitoDB, StatusLeito
from models.atendimento import AtendimentoDB, StatusAtendimento
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo


def resumo_dashboard_service(db: Session):

    comando_leito = select(
        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True)
        ).label("leitos_total"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.ocupado
        ).label("leitos_ocupados"),

        func.count(LeitoDB.id)
        .filter(
            LeitoDB.ativo.is_(True),
            LeitoDB.status == StatusLeito.disponivel
        ).label("leitos_disponiveis"),
    )

    resultado_leitos = db.execute(
        comando_leito
    ).mappings().one()


    comando_atendimentos = select(
        func.count(AtendimentoDB.id)
    ).where(AtendimentoDB.data_saida.is_(None))

    pacientes_em_atendimento = (
        db.scalar(comando_atendimentos) or 0
    )


    leitos_total = resultado_leitos["leitos_total"]
    leitos_ocupados = resultado_leitos["leitos_ocupados"]
    leitos_disponiveis = resultado_leitos["leitos_disponiveis"]

    if leitos_total == 0:
        porcentagem_ocupacao = 0.0
    else:
        porcentagem_ocupacao = round(
            (leitos_ocupados / leitos_total) * 100, 2
        )


    fuso_horario = ZoneInfo("America/Sao_Paulo")

    data_atual = datetime.now(fuso_horario)

    inicio_hoje = data_atual.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    inicio_amanha = inicio_hoje + timedelta(days=1)

    comando_altas_hoje = select(
        func.count(AtendimentoDB.id)
    ).where(
        AtendimentoDB.status == StatusAtendimento.alta,
        AtendimentoDB.data_saida >= inicio_hoje,
        AtendimentoDB.data_saida < inicio_amanha
    )

    altas_hoje = (
        db.scalar(comando_altas_hoje) or 0
    )


    return {
        "leitos_total": leitos_total,
        "leitos_ocupados": leitos_ocupados,
        "leitos_disponiveis": leitos_disponiveis,
        "porcentagem_ocupacao": porcentagem_ocupacao,
        "pacientes_em_atendimento": pacientes_em_atendimento,
        "altas_hoje": altas_hoje
    }