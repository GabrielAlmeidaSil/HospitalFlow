import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient)

  login(dados: LoginRequest) {
    return this.http.post<LoginResponse>(
      'http://127.0.0.1:8000/auth/login',
      dados
    );
  }
}

