export type StatusLeito =
    | 'disponivel'
    | 'ocupado'
    | 'higienizacao'
    | 'manutencao';

export interface SetorResumo {
    id: number;
    nome: string;
}

export interface LeitoResponse {
    id: number;
    codigo: string;
    status: StatusLeito;
    ativo: boolean;
    setor_id: number;
    setor: SetorResumo;
}

export interface CriarLeitoRequest {
    codigo: string;
    setor_id: number;
}

export interface AtualizarLeitoRequest {
    codigo?: string;
    setor_id?: number;
}

export interface FiltrosLeito {
    busca?: string;
    setor_id?: number;
    status?: StatusLeito;
    ativo?: boolean;
}

export interface ResumoLeitosResponse {
  total: number;
  disponiveis: number;
  ocupados: number;
  higienizacao: number;
  manutencao: number;
}