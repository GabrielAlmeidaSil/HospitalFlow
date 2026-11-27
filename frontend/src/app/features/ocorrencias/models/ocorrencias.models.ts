export type StatusPrioridade =
    | 'baixa'
    | 'media'
    | 'alta'
    | 'critica';

export type StatusOcorrencia = 
    | 'aberta' 
    | 'em_resolucao'
    | 'resolvida'

export interface ResumoOcorrenciasResponse {
    abertas: number;
    em_resolucao: number;
    criticas_pendentes: number;
    resolvidas_hoje: number;
}

export interface SetorOcorrencia {
    id: number;
    nome: string;
}

export interface UsuarioOcorrencia {
    id: number;
    nome: string;
} 

export interface OcorrenciaResponse {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: StatusPrioridade;
  status: StatusOcorrencia;
  setor: SetorOcorrencia;
  criado_por: UsuarioOcorrencia;
  responsavel: UsuarioOcorrencia | null;
  data_abertura: string;
  data_inicio_resolucao: string | null;
  data_resolucao: string | null;
  descricao_resolucao: string | null;
}

export interface FiltrosOcorrencia {
    busca?: string;
    setor_id?: number;
    prioridade?: StatusPrioridade;
    status?: StatusOcorrencia; 
}

export interface CriarOcorrenciaRequest {
    titulo: string;
    descricao: string;
    prioridade: StatusPrioridade;
    setor_id: number;
}

export interface ResolverOcorrenciaRequest {
    descricao_resolucao: string;
}