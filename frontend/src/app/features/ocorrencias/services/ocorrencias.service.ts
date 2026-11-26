import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResumoOcorrenciasResponse } from '../models/ocorrencias.models';

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
}
