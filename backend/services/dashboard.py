from sqlalchemy import select, func
from sqlalchemy.orm import Session
from models.leito import LeitoDB, StatusLeito
from models.atendimento import AtendimentoDB, StatusAtendimento
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from models.setor import SetorDB


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


def ocupacao_setores_service(db: Session):
    comando_leitos = (
        select(
            SetorDB.id.label("setor_id"),
            SetorDB.nome.label("setor_nome"),

            func.count(LeitoDB.id)
            .filter(
                LeitoDB.ativo.is_(True)
            ).label("leitos_total"),

            func.count(LeitoDB.id)
            .filter(
                LeitoDB.ativo.is_(True),
                LeitoDB.status == StatusLeito.ocupado
            ).label("leitos_ocupados")
        ).outerjoin(
            LeitoDB,
            LeitoDB.setor_id == SetorDB.id
        ).where(
            SetorDB.ativo.is_(True)
        ).group_by(
            SetorDB.id,
            SetorDB.nome
        )
    )


    resultado_leitos = db.execute(
        comando_leitos
    ).mappings().all()


    setores = []

    for item in resultado_leitos:
        leitos_total = item["leitos_total"]
        leitos_ocupados = item["leitos_ocupados"]

        if leitos_total == 0:
            porcentagem_ocupacao = 0.0

        else:

            porcentagem_ocupacao = round(
                (leitos_ocupados / leitos_total) * 100,2
            )


        setores.append({
            "setor_id":
                item["setor_id"],

            "setor_nome":
                item["setor_nome"],

            "leitos_total":
                leitos_total,

            "leitos_ocupados":
                leitos_ocupados,

            "porcentagem_ocupacao":
                porcentagem_ocupacao
        })


    return setores


def distribuicao_atendimentos_service(db: Session):

    comando = (
        select(
            AtendimentoDB.status,

            func.count(
                AtendimentoDB.id
            ).label("quantidade")
        )
        .where(
            AtendimentoDB.data_saida.is_(None)
        ).group_by(
            AtendimentoDB.status
        )
    )

    resultado = db.execute(
        comando
    ).mappings().all()


    constagens = {
        item["status"]: item["quantidade"]
        for item in resultado
    }


    status_abertos = [
        StatusAtendimento.em_atendimento,
        StatusAtendimento.observacao,
        StatusAtendimento.internado,
    ]

    total = sum(
        constagens.get(status, 0)
        for status in status_abertos
    )


    distribuicao = []

    for status in status_abertos:
        quantidade = constagens.get(
            status,
            0
        )

        if total == 0:
            porcentagem_ocupacao = 0.0
        else:
            porcentagem_ocupacao = round(
                (quantidade / total) * 100, 2
            )

        distribuicao.append({
            "status": status,
            "quantidade": quantidade,
            "porcentagem_ocupacao": porcentagem_ocupacao
        })

    
    return distribuicao