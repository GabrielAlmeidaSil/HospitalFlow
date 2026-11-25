import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResumoDashboardResponse, OcupacaoSetorResponse, DistribuicaoAtendimentosResponse, AtendimentosRecentesResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/dashboard';


  resumo() {
    return this.http.get<ResumoDashboardResponse>(
      `${this.apiUrl}/resumo`
    );
  }

  ocupacaoPorSetores() {
    return this.http.get<OcupacaoSetorResponse[]>(
      `${this.apiUrl}/ocupacao-setores`
    );
  }

  distribuicaoAtendimentos() {
    return this.http.get<DistribuicaoAtendimentosResponse[]>(
      `${this.apiUrl}/distribuicao-atendimentos`
    );
  }

  atendimentosRecentes() {
    return this.http.get<AtendimentosRecentesResponse[]>(
      `${this.apiUrl}/atendimentos-recentes`
    );
  }

}
