import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  CriarLeitoRequest,
  LeitoResponse,
  AtualizarLeitoRequest,
  FiltrosLeito,
  ResumoLeitosResponse
} from '../models/leito.models';


@Injectable({
  providedIn: 'root',
})
export class LeitoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/leitos';


  listar(filtros: FiltrosLeito = {}) {

    const params: Record<
      string,
      string | number | boolean
    > = {};

    if (filtros.busca) {
      params['busca'] = filtros.busca;
    }

    if (filtros.setor_id !== undefined) {
      params['setor_id'] = filtros.setor_id;
    }

    if (filtros.status !== undefined) {
      params['status'] = filtros.status;
    }

    if (filtros.ativo !== undefined) {
      params['ativo'] = filtros.ativo;
    }

    return this.http.get<LeitoResponse[]>(
      `${this.apiUrl}/`,
      { params }
    );
  }


  criar(dados: CriarLeitoRequest) {
    return this.http.post<LeitoResponse>(
      `${this.apiUrl}/`,
      dados
    );
  }


  editar(
    id: number,
    dados: AtualizarLeitoRequest
  ) {
    return this.http.patch<LeitoResponse>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }


  alterarSituacao(
    id: number,
    ativo: boolean
  ) {
    return this.http.patch<LeitoResponse>(
      `${this.apiUrl}/${id}/situacao`,
      { ativo }
    );
  }


  resumo() {
    return this.http.get<ResumoLeitosResponse>(
      `${this.apiUrl}/resumo`
    );
  }
}