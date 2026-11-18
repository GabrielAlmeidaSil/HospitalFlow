import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { LeitoService } from '../../services/leito.service';
import { CriarLeitoRequest, FiltrosLeito, LeitoResponse, ResumoLeitosResponse, StatusLeito } from '../../models/leito.models';
import { Setor } from '../../../setores/services/setor';
import { SetorResponse } from '../../../setores/models/setor.models';

@Component({
  selector: 'app-leitos',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './leitos.html',
  styleUrl: './leitos.scss',
})
export class Leitos implements OnInit {
  // SERVICES
  private leitoService = inject(LeitoService);
  private setorService = inject(Setor);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // DADOS QUE VEM DA API/BANCO
  leitos = signal<LeitoResponse[]>([]);
  setores = signal<SetorResponse[]>([]);
  resumo = signal<ResumoLeitosResponse>({
    total: 0,
    disponiveis: 0,
    ocupados: 0,
    higienizacao: 0,
    manutencao: 0
  });

  carregando = signal(false);
  erro = signal('');

  // VALORES DOS FILTROS
  busca = signal('');
  setorSelecionado = signal<number | null>(null);
  statusSelecionado = signal<StatusLeito | null>(null);
  situacaoSelecionada = signal<boolean | null>(null);

  // OPCOES SELECT
  statusOpcoes = [
    { nome: 'Todos os status', valor: null },
    { nome: 'Disponível', valor: 'disponivel' },
    { nome: 'Ocupado', valor: 'ocupado' },
    { nome: 'Higienização', valor: 'higienizacao' },
    { nome: 'Manutenção', valor: 'manutencao' }
  ];

  situacaoOpcoes = [
    { nome: 'Todos', valor: null },
    { nome: 'Ativos', valor: true },
    { nome: 'Inativos', valor: false }
  ];

  // TEXTO E COR STATUS
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

  // MODAL CRIAR/EDITAR LEITO
  visible: boolean = false;
  leitoEmEdicao = signal<LeitoResponse | null>(null);

  formLeito = new FormGroup({
    codigo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ]
    }),

    setor_id: new FormControl<number | null>(null, Validators.required)
  });

  // ID DO LEITO QUE ESTA SENDO ATIVADO/DESATIVADO
  processandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.carregarSetores();
    this.atualizarDados();
  }

  // ATUALIZA CARDS E TABELA 
  atualizarDados() {
    this.carregarLeitos();
    this.carregarResumo();
  }

  // BUSCA LEITO COM OS FILTROS
  carregarLeitos() {
    this.carregando.set(true);
    this.erro.set('');

    const filtros: FiltrosLeito = {};

    const busca = this.busca().trim();
    if (busca) {
      filtros.busca = busca;
    }

    const setorId = this.setorSelecionado();
    if (setorId !== null) {
      filtros.setor_id = setorId;
    }

    const status = this.statusSelecionado();
    if (status !== null) {
      filtros.status = status;
    }

    const situacao = this.situacaoSelecionada();
    if (situacao !== null) {
      filtros.ativo = situacao;
    }

    this.leitoService.listar(filtros).subscribe({
      next: (leitos) => {
        this.leitos.set(leitos);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error(erro);
        this.erro.set('Não foi possível carregar os leitos.');
        this.carregando.set(false);
      }
    });
  }

  // BUSCA SETORES PARA OS SELECTS
  carregarSetores() {
    this.setorService.listarSetores().subscribe({
      next: (setores) => {
        this.setores.set(setores);
      },
      error: (erro) => {
        console.error('Erro ao carregar setores: ', erro);
      }
    });
  }

  // BUSCA AS INFORMAÇÕES DOS CARDS
  carregarResumo() {
    this.leitoService.resumo().subscribe({
      next: (resumo) => {
        this.resumo.set(resumo);
      },
      error: (erro) => {
        console.error('Erro ao carregar resumo dos leitos: ', erro);
      }
    });
  }

  // CALCULO PORCENTAGEM CARD
  calcularPercentuais(valor: number): number {
    const total = this.resumo().total;

    if (total === 0) {
      return 0;
    }

    return Math.round((valor / total) * 100);
  }

  // ABRE O MODAL VAZIO
  abrirCriacao() {
    this.leitoEmEdicao.set(null);
    this.formLeito.reset({ codigo: '', setor_id: null });
    this.visible = true;
  }

  // ABRE O MODAL PREENCHIDO
  abrirEdicao(leito: LeitoResponse) {
    this.leitoEmEdicao.set(leito);
    this.formLeito.reset({ codigo: leito.codigo, setor_id: leito.setor_id });
    this.visible = true;
  }

  // CRIA OU EDITA O LEITO
  salvar() {
    if (this.formLeito.invalid) {
      this.formLeito.markAllAsTouched();
      return;
    }

    const { codigo, setor_id } = this.formLeito.getRawValue();
    if (setor_id === null) return;

    const dados: CriarLeitoRequest = { codigo: codigo.trim(), setor_id };
    const leito = this.leitoEmEdicao();

    const requisicao = leito
      ? this.leitoService.editar(leito.id, dados)
      : this.leitoService.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.visible = false;
        this.atualizarDados();
      },
      error: (erro) => console.error(erro)
    });
  }

  // ATIVAR E DESATIVAR PEDINDO CONFIRMAÇÃO
  alterarSituacao(leito: LeitoResponse) {
    if (!leito.ativo) {
      this.enviarAlteracaoSituacao(leito, true);
      return;
    }

    this.confirmationService.confirm({
      header: 'Desativar leito',
      message: `Deseja realmente desativar o leito ${leito.codigo}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desativar',
      rejectLabel: 'Cancelar',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.enviarAlteracaoSituacao(leito, false)
    });
  }

  // CHAMA A API E CONFIRMA SE DEU CERTO OU NAO
  private enviarAlteracaoSituacao(leito: LeitoResponse, ativo: boolean) {
    this.processandoId.set(leito.id);

    this.leitoService.alterarSituacao(leito.id, ativo)
      .pipe(finalize(() => this.processandoId.set(null)))
      .subscribe({
        next: (atualizado) => {
          this.atualizarDados();

          const acao = atualizado.ativo ? 'ativado' : 'desativado';

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Leito ${atualizado.codigo} ${acao}.`
          });
        },
        error: (erro) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: erro.error?.detail ?? 'Não foi possível alterar a situação do leito.'
          });
        }
      });
  }
}
