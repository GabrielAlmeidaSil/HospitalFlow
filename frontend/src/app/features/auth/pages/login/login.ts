import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html'
})
export class Login {

  private authService = inject(Auth);
  private router = inject(Router);

  formulario = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    senha: new FormControl('', [
      Validators.required
    ])
  });

  entrar() {
    if (this.formulario.invalid) {
      return;
    }

    const dados = {
      email: this.formulario.value.email!,
      senha: this.formulario.value.senha!
    }

    this.authService.login(dados).subscribe({
      next: (resposta) => {
        this.authService.salvarToken(
          resposta.access_token
        );

        this.router.navigate(['/dashboard']);
      },

      error: (erro) => {
        console.log('Erro no login:', erro)
      }
    });
  }

}
