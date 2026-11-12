import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, UsuarioResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient)
  private readonly tokenKey = 'hospitalflow_token';

  login(dados: LoginRequest) {
    return this.http.post<LoginResponse>(
      'http://127.0.0.1:8000/auth/login',
      dados
    );
  }

  salvarToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  obterToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  removerToken() {
    localStorage.removeItem(this.tokenKey)
  }

  estaAutenticado(): boolean {
    return this.obterToken() !== null;
  }

  obter_usuario_atual() {
    return this.http.get<UsuarioResponse>(
      'http://127.0.0.1:8000/auth/me'
    )
  }
}

