import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  PacienteResponse,
  CriarPacienteRequest,
  AtualizarPacienteRequest,
  FiltrosPaciente,
  ResumoPacientesResponse,
  PacienteListagemResponse
} from '../models/paciente.models';

@Injectable({
  providedIn: 'root',
})
export class Paciente {

  private http = inject(HttpClient)

  private apiUrl = 'http://127.0.0.1:8000/pacientes';

  listar(filtros: FiltrosPaciente = {}) {
    const params: Record<
      string,
      string | boolean
    > = {};

    if (filtros.busca) {
      params['busca'] = filtros.busca
    }

    if (filtros.ativo !== undefined) {
      params['ativo'] = filtros.ativo
    }

    return this.http.get<PacienteListagemResponse[]>(
      `${this.apiUrl}/`,
      { params }
    );
  }


  criar(dados: CriarPacienteRequest) {
    return this.http.post<PacienteResponse>(
      `${this.apiUrl}/`,
      dados
    );
  }

  
  editar(id: number, dados: AtualizarPacienteRequest) {
    return this.http.patch<PacienteResponse>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }


  alterarSituacao(id: number, ativo: boolean) {
    return this.http.patch<PacienteResponse>(
      `${this.apiUrl}/${id}/situacao`,
      { ativo }
    );
  }


  resumo() {
    return this.http.get<ResumoPacientesResponse>(
      `${this.apiUrl}/resumo`
    )
  }
}
