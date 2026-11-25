export interface ResumoDashboardResponse {
    leitos_total: number;
    leitos_ocupados: number;
    leitos_disponiveis: number;
    porcentagem_ocupacao: number;
    pacientes_em_atendimento: number;
    altas_hoje: number;
}

export interface OcupacaoSetorResponse {
    setor_id: number;
    setor_nome: string;
    leitos_total: number;
    leitos_ocupados: number;
    porcentagem_ocupacao: number;
}

export type StatusDistribuicaoAtendimento =
    | "em_atendimento"
    | "observacao"
    | "internado";


export interface DistribuicaoAtendimentosResponse {
    status: StatusDistribuicaoAtendimento;
    quantidade: number;
    porcentagem_ocupacao: number;
}


export type StatusAtendimentosRecentes = 
    | "em_atendimento"
    | "observacao"
    | "internado"
    | "alta";


export interface AtendimentosRecentesResponse {
    id: number;
    paciente_nome: string;
    status: StatusAtendimentosRecentes;
    setor_nome: string | null;
    leito_codigo: string| null;
    data_entrada: string;
}