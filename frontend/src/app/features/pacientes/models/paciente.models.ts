export interface PacienteResponse {
    id: number;
    nome: string;
    cpf: string;
    data_nascimento: string;
    ativo: boolean;
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