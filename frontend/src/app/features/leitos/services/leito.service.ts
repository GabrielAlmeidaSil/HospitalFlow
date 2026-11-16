import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarLeitoRequest, LeitoResponse } from '../models/leito.models';
import { Setor } from '../../setores/services/setor';

@Injectable({
  providedIn: 'root',
})
export class LeitoService {
  private http = inject(HttpClient)
  private setorService = inject(Setor)

  private apiUrl = 'http://127.0.0.1:8000/leitos'


  listar() {
    return this.http.get<LeitoResponse[]>(
      `${this.apiUrl}/`
    );
  }

  criar(dados: CriarLeitoRequest) {
    return this.http.post<LeitoResponse>(
      `${this.apiUrl}/`,
      dados
    )
  }
}
