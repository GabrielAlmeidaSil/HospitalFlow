import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetorResponse } from '../models/setor.models';

@Injectable({
  providedIn: 'root',
})
export class Setor {
  private http = inject(HttpClient)

  private apiUrl = 'http://127.0.0.1:8000/setores'

  listarSetores() {
    return this.http.get<SetorResponse[]>(
      `${this.apiUrl}/`
    )
  }
}
