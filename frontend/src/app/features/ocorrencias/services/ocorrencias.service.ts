import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarOcorrenciaRequest, FiltrosOcorrencia, ResolverOcorrenciaRequest, ResumoOcorrenciasResponse } from '../models/ocorrencias.models';
import { OcorrenciaResponse } from '../models/ocorrencias.models';

@Injectable({
  providedIn: 'root',
})
export class OcorrenciasService {

  private http = inject(HttpClient)
  private apiUrl = 'http://127.0.0.1:8000/ocorrencias'

  resumo() {
    return this.http.get<ResumoOcorrenciasResponse>(
      `${this.apiUrl}/resumo`
    );
  }

  listar(filtros: FiltrosOcorrencia) {

    const params: Record<string, string | number> = {};

    if(filtros.busca) {
      params['busca'] = filtros.busca;
    }

    if(filtros.setor_id !== undefined) {
      params['setor_id'] = filtros.setor_id;
    }

    if(filtros.prioridade) {
      params['prioridade'] = filtros.prioridade
    }

    if(filtros.status) {
      params['status'] = filtros.status;
    }

    return this.http.get<OcorrenciaResponse[]>(
      `${this.apiUrl}/`,
      { params }
    );
  }

  criar(dados: CriarOcorrenciaRequest) {
    return this.http.post<OcorrenciaResponse>(
      `${this.apiUrl}/`,
      dados
    );
  }

  assumir(id: number) {
    return this.http.patch<OcorrenciaResponse>(
      `${this.apiUrl}/${id}/assumir`,
      null
    )
  }

  resolver(id: number, dados: ResolverOcorrenciaRequest) {
    return this.http.patch<OcorrenciaResponse>(
      `${this.apiUrl}/${id}/resolver`,
      dados
    )
  }
}
