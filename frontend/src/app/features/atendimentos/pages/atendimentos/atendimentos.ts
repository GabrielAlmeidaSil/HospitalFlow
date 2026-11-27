import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import {
  AlterarStatusAtendimentoRequest,
  AtendimentoResponse,
  FiltrosAtendimento,
  ResumoAtendimentosResponse,
  StatusAtendimento
} from '../../models/atendimento.models';

import { AtendimentoService } from '../../services/atendimento.service';

import { Setor } from '../../../setores/services/setor';
import { SetorResponse } from '../../../setores/models/setor.models';

import { Paciente } from '../../../pacientes/services/paciente.service';
import { PacienteResponse } from '../../../pacientes/models/paciente.models';

import { LeitoService } from '../../../leitos/services/leito.service';
import { LeitoResponse } from '../../../leitos/models/leito.models';


@Component({
  selector: 'app-atendimentos',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,

    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './atendimentos.html',
  styleUrl: './atendimentos.scss',
})
export class Atendimentos implements OnInit {

  // SERVICES
  private atendimentoService = inject(AtendimentoService);
  private setorService = inject(Setor);
  private pacienteService = inject(Paciente);
  private leitoService = inject(LeitoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);


  // DADOS
  atendimentos = signal<AtendimentoResponse[]>([]);
  setores = signal<SetorResponse[]>([]);
  pacientes = signal<PacienteResponse[]>([]);
  leitosDisponiveis = signal<LeitoResponse[]>([]);

  carregando = signal(false);


  // RESUMO
  resumo = signal<ResumoAtendimentosResponse>({
    total: 0,
    em_atendimento: 0,
    observacao: 0,
    internados: 0,
    altas: 0
  });


  // FILTROS
  busca = signal('');

  statusSelecionado = signal<StatusAtendimento | null>(null);

  setorSelecionado = signal<number | null>(null);

  situacaoSelecionada = signal<boolean | null>(null);


  // OPÇÕES STATUS
  statusOpcoes: {
    nome: string;
    valor: StatusAtendimento | null;
  }[] = [
    {
      nome: 'Todos',
      valor: null
    },
    {
      nome: 'Em atendimento',
      valor: 'em_atendimento'
    },
    {
      nome: 'Em observação',
      valor: 'observacao'
    },
    {
      nome: 'Internado',
      valor: 'internado'
    },
    {
      nome: 'Alta',
      valor: 'alta'
    }
  ];


  // OPÇÕES SITUAÇÃO
  situacaoOpcoes: {
    nome: string;
    valor: boolean | null;
  }[] = [
    {
      nome: 'Todos',
      valor: null
    },
    {
      nome: 'Em aberto',
      valor: true
    },
    {
      nome: 'Encerrados',
      valor: false
    }
  ];


  // TEXTO STATUS
  nomeStatus: Record<StatusAtendimento, string> = {
    em_atendimento: 'Em atendimento',
    observacao: 'Em observação',
    internado: 'Internado',
    alta: 'Alta'
  };


  // OPÇÕES ALTERAR STATUS (SEM ALTA)
  statusAlteraveis: {
    nome: string;
    valor: AlterarStatusAtendimentoRequest['status'];
  }[] = [
    { nome: 'Em atendimento', valor: 'em_atendimento' },
    { nome: 'Em observação', valor: 'observacao' },
    { nome: 'Internado', valor: 'internado' }
  ];


  // ATENDIMENTO ESCOLHIDO NA TABELA
  atendimentoSelecionado = signal<AtendimentoResponse | null>(null);


  // MODAIS
  visibleNovo: boolean = false;
  visibleDetalhes: boolean = false;
  visibleStatus: boolean = false;
  visibleTransferencia: boolean = false;


  // FORM NOVO ATENDIMENTO
  formNovo = new FormGroup({
    paciente_id: new FormControl<number | null>(null, Validators.required),
    setor_id: new FormControl<number | null>(null),
    leito_id: new FormControl<number | null>(null)
  });


  // FORM ALTERAR STATUS
  novoStatus = signal<AlterarStatusAtendimentoRequest['status'] | null>(null);


  // FORM TRANSFERÊNCIA
  formTransferencia = new FormGroup({
    setor_id: new FormControl<number | null>(null, Validators.required),
    leito_id: new FormControl<number | null>(null)
  });


  ngOnInit(): void {
    this.carregarSetores();
    this.atualizarDados();
  }


  atualizarDados() {
    this.listarAtendimentos();
    this.carregarResumo();
  }


  carregarSetores() {

    this.setorService
      .listarSetores()
      .subscribe({

        next: (setores) => {
          this.setores.set(setores);
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar setores:',
            erro
          );
        }

      });
  }


  listarAtendimentos() {

    this.carregando.set(true);

    const filtros: FiltrosAtendimento = {};


    // BUSCA
    const busca = this.busca().trim();

    if (busca) {
      filtros.busca = busca;
    }


    // STATUS
    const status = this.statusSelecionado();

    if (status !== null) {
      filtros.status = status;
    }


    // SETOR
    const setorId = this.setorSelecionado();

    if (setorId !== null) {
      filtros.setor_id = setorId;
    }


    // SITUAÇÃO
    const situacao = this.situacaoSelecionada();

    if (situacao !== null) {
      filtros.aberto = situacao;
    }


    // API
    this.atendimentoService
      .listar(filtros)
      .subscribe({

        next: (atendimentos) => {
          this.atendimentos.set(atendimentos);
          this.carregando.set(false);
        },

        error: (erro) => {
          console.error(
            'Erro ao listar atendimentos:',
            erro
          );

          this.carregando.set(false);
        }

      });
  }


  carregarResumo() {

    this.atendimentoService
      .resumo()
      .subscribe({

        next: (resumo) => {
          this.resumo.set(resumo);
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar resumo:',
            erro
          );
        }

      });
  }


  formatarCpf(cpf: string): string {
    return cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }


  calcularPercentual(valor: number): number {

    const total = this.resumo().total;

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (valor / total) * 100
    );
  }


  carregarPacientesAtivos() {
    this.pacienteService.listar({ ativo: true }).subscribe({
      next: (pacientes) => {
        this.pacientes.set(pacientes);
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes:', erro);
      }
    });
  }


  carregarLeitosDisponiveis(setorId: number | null) {
    this.leitosDisponiveis.set([]);

    if (setorId === null) {
      return;
    }

    this.leitoService.listar({ setor_id: setorId, status: 'disponivel', ativo: true }).subscribe({
      next: (leitos) => {
        this.leitosDisponiveis.set(leitos);
      },
      error: (erro) => {
        console.error('Erro ao carregar leitos:', erro);
      }
    });
  }


  mostrarErro(erro: any, mensagemPadrao: string) {
    const detail = erro.error?.detail;

    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: typeof detail === 'string' ? detail : mensagemPadrao
    });
  }


  // NOVO ATENDIMENTO
  abrirNovo() {
    this.formNovo.reset({ paciente_id: null, setor_id: null, leito_id: null });
    this.leitosDisponiveis.set([]);
    this.carregarPacientesAtivos();
    this.visibleNovo = true;
  }

  salvarNovo() {
    if (this.formNovo.invalid) {
      this.formNovo.markAllAsTouched();
      return;
    }

    const { paciente_id, setor_id, leito_id } = this.formNovo.getRawValue();
    if (paciente_id === null) return;

    this.atendimentoService.criar({ paciente_id, setor_id, leito_id }).subscribe({
      next: () => {
        this.visibleNovo = false;
        this.atualizarDados();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Atendimento criado.'
        });
      },
      error: (erro) => this.mostrarErro(erro, 'Não foi possível criar o atendimento.')
    });
  }


  // DETALHES
  abrirDetalhes(atendimento: AtendimentoResponse) {
    this.atendimentoSelecionado.set(atendimento);
    this.visibleDetalhes = true;
  }


  // ALTERAR STATUS
  abrirAlterarStatus(atendimento: AtendimentoResponse) {
    this.atendimentoSelecionado.set(atendimento);
    this.novoStatus.set(atendimento.status === 'alta' ? null : atendimento.status);
    this.visibleStatus = true;
  }

  salvarStatus() {
    const atendimento = this.atendimentoSelecionado();
    const status = this.novoStatus();
    if (atendimento === null || status === null) return;

    this.atendimentoService.alterarStatus(atendimento.id, { status }).subscribe({
      next: () => {
        this.visibleStatus = false;
        this.atualizarDados();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status alterado.'
        });
      },
      error: (erro) => this.mostrarErro(erro, 'Não foi possível alterar o status.')
    });
  }


  // TRANSFERÊNCIA
  abrirTransferencia(atendimento: AtendimentoResponse) {
    this.atendimentoSelecionado.set(atendimento);
    this.formTransferencia.reset({ setor_id: null, leito_id: null });
    this.leitosDisponiveis.set([]);
    this.visibleTransferencia = true;
  }

  salvarTransferencia() {
    if (this.formTransferencia.invalid) {
      this.formTransferencia.markAllAsTouched();
      return;
    }

    const atendimento = this.atendimentoSelecionado();
    const { setor_id, leito_id } = this.formTransferencia.getRawValue();
    if (atendimento === null || setor_id === null) return;

    this.atendimentoService.transferir(atendimento.id, { setor_id, leito_id }).subscribe({
      next: () => {
        this.visibleTransferencia = false;
        this.atualizarDados();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Paciente transferido.'
        });
      },
      error: (erro) => this.mostrarErro(erro, 'Não foi possível transferir o paciente.')
    });
  }


  // ALTA
  darAlta(atendimento: AtendimentoResponse) {
    this.confirmationService.confirm({
      header: 'Dar alta',
      message: `Deseja realmente dar alta para ${atendimento.paciente.nome}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar alta',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'success' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.atendimentoService.darAlta(atendimento.id).subscribe({
          next: () => {
            this.atualizarDados();

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Alta registrada para ${atendimento.paciente.nome}.`
            });
          },
          error: (erro) => this.mostrarErro(erro, 'Não foi possível dar alta.')
        });
      }
    });
  }
}