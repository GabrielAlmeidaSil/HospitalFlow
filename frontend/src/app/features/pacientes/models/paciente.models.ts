export interface PacienteResponse {
    id: number;
    nome: string;
    cpf: string;
    data_nascimento: string;
    ativo: boolean;
}

export type StatusAtendimentoAtual =
    | 'em_atendimento'
    | 'observacao'
    | 'internado'

export interface SetorAtualPaciente {
    id: number;
    nome: string;
}

export interface LeitoAtualPaciente {
    id: number;
    codigo: string;
}

export interface AtendimentoAtualPaciente {
    id: number;
    status: StatusAtendimentoAtual;
    setor: SetorAtualPaciente | null;
    leito: LeitoAtualPaciente | null;
}

export interface PacienteListagemResponse extends PacienteResponse {
    atendimento_atual: AtendimentoAtualPaciente | null;
}

export interface CriarPacienteRequest {
    nome: string;
    cpf: string;
    data_nascimento: string;
}


export interface AtualizarPacienteRequest {
    nome?: string;
    cpf?: string;
    data_nascimento?: string;
}

export interface FiltrosPaciente {
    busca?: string;
    ativo?: boolean;
}

export interface ResumoPacientesResponse {
    total: number;
    ativos: number;
    inativos: number;
}