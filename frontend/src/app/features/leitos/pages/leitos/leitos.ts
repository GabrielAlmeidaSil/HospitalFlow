import { Component, inject, OnInit, signal } from '@angular/core';
import { LeitoService } from '../../services/leito.service';
import { LeitoResponse } from '../../models/leito.models';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Setor } from '../../../setores/services/setor';
import { SetorResponse } from '../../../setores/models/setor.models';

interface Filtro {
  nome: string;
}

@Component({
  selector: 'app-leitos',
  imports: [
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule
  ],
  templateUrl: './leitos.html',
  styleUrl: './leitos.scss',
})
export class Leitos implements OnInit {
  private leitoService = inject(LeitoService);
  private setorService = inject(Setor)

  leitos = signal<LeitoResponse[]>([]);

  carregando = signal(false);

  erro = signal('')

  setores = signal<SetorResponse[]>([]);
  setorSelecionado: Filtro | undefined;

  status: Filtro[] = [];
  statusSelecionado: Filtro | undefined;

  situacoes: Filtro[] = [];
  situacaoSelecionada: Filtro | undefined;

  nomeStatus: any = {
    disponivel: 'Disponível',
    ocupado: 'Ocupado',
    higienizacao: 'Higienização',
    manutencao: 'Manutenção'
  };

  corStatus: any = {
    disponivel: 'bg-[#E4F9F7] text-[#0F966E]',
    ocupado: 'bg-[#FDE8E8] text-[#C81E1E]',
    higienizacao: 'bg-[#FDF5E1] text-[#CE941B]',
    manutencao: 'bg-[#EEE3FD] text-[#5F13AE]'
  };

  ngOnInit(): void {
    this.carregarLeitos();
    this.carregarSetores();

    this.status = [
      { nome: 'Todos os status' },
      { nome: 'Disponível' },
      { nome: 'Ocupado' },
      { nome: 'Higienização' },
      { nome: 'Manutenção' }
    ];
    this.statusSelecionado = this.status[0];

    this.situacoes = [
      { nome: 'Todos' },
      { nome: 'Ativos' },
      { nome: 'Inativos' }
    ];
    this.situacaoSelecionada = this.situacoes[0];
  }

  carregarLeitos() {
    this.carregando.set(true);
    this.erro.set('');

    this.leitoService.listar().subscribe({
      next: (leitos) => {
        this.leitos.set(leitos);
        this.carregando.set(false);
      },

      error: (erro) => {
        console.error(erro)

        this.erro.set("Não foi possível carregar os leitos.");
        this.carregando.set(false);
      }

    });
  }


  carregarSetores() {
    this.setorService.listarSetores().subscribe({
      next: (setores) => {
        this.setores.set(setores)
      },
      error: (erro) => {
        console.error('Erro ao carregar setores: ', erro)
      }
    })
  }
}
