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
    status: StatusLeito;
    setor_id: number;
}