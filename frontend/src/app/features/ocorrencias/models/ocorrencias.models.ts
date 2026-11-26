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