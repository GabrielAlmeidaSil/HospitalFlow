import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FiltrosAtendimento, ResumoAtendimentosResponse } from '../models/atendimento.models';
import { AtendimentoResponse, CriarAtendimentoRequest, AlterarStatusAtendimentoRequest, TransferirAtendimentoRequest } from '../models/atendimento.models';

@Injectable({
  providedIn: 'root',
})
export class AtendimentoService {

  private http = inject(HttpClient)

  private apiUrl = 'http://127.0.0.1:8000/atendimentos'


  listar(filtros: FiltrosAtendimento = {}) {

    const params: Record<
      string,
      string | number | boolean
    > = {};

    if (filtros.busca) {
      params['busca'] = filtros.busca;
    }

    if (filtros.status !== undefined) {
      params['status'] = filtros.status;
    }

    if (filtros.setor_id !== undefined) {
      params['setor_id'] = filtros.setor_id;
    }

    if (filtros.aberto !== undefined) {
      params['aberto'] = filtros.aberto;
    }

    return this.http.get<AtendimentoResponse[]>(
      `${this.apiUrl}/`,
      { params }
    );
  }


  resumo() {
    return this.http.get<ResumoAtendimentosResponse>(
      `${this.apiUrl}/resumo`
    );
  }


  criar(dados: CriarAtendimentoRequest) {
    return this.http.post<AtendimentoResponse>(
      `${this.apiUrl}/`,
      dados
    );
  }


  alterarStatus(id: number, dados: AlterarStatusAtendimentoRequest) {
    return this.http.patch<AtendimentoResponse>(
      `${this.apiUrl}/${id}/status`,
      dados
    );
  }


  transferir(id: number, dados: TransferirAtendimentoRequest) {
    return this.http.patch<AtendimentoResponse>(
      `${this.apiUrl}/${id}/transferencia`,
      dados
    );
  }


  darAlta(id: number) {
    return this.http.patch<AtendimentoResponse>(
      `${this.apiUrl}/${id}/alta`,
      {}
    );
  }

}
