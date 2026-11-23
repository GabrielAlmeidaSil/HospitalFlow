export type StatusAtendimento = 
    | 'em_atendimento'
    | 'observacao'
    | 'internado'
    | 'alta';


export interface PacienteResumoAtendimento {
    id: number;
    nome: string; 
    cpf: string;
}


export interface SetorResumoAtendimento {
    id: number;
    nome: string;
}


export interface LeitoResumoAtendimento {
    id: number;
    codigo: string;
}


export interface AtendimentoResponse {
  id: number;

  paciente_id: number;
  status: StatusAtendimento;

  setor_id: number | null;
  leito_id: number | null;

  data_entrada: string;
  data_saida: string | null;

  paciente: PacienteResumoAtendimento;
  setor: SetorResumoAtendimento | null;
  leito: LeitoResumoAtendimento | null;
}



export interface CriarAtendimentoRequest {
  paciente_id: number;
  setor_id: number | null;
  leito_id: number | null;
}


export interface AlterarStatusAtendimentoRequest {
  status: Exclude<StatusAtendimento, 'alta'>;
}


export interface TransferirAtendimentoRequest {
  setor_id: number;
  leito_id: number | null;
}



export interface FiltrosAtendimento {
  busca?: string;
  status?: StatusAtendimento;
  setor_id?: number;
  aberto?: boolean;
}



export interface ResumoAtendimentosResponse {
  total: number;
  em_atendimento: number;
  observacao: number;
  internados: number;
  altas: number;
}