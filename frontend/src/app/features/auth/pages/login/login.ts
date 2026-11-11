import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Inject } from '@angular/core';
import { Auth } from '../../../../core/services/auth';

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

  private authService = inject(Auth)

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
        console.log('Login realizado:', resposta);
      },

      error: (erro) => {
        console.log('Erro no login:', erro)
      }
    });
  }

}
