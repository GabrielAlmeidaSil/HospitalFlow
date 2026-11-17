import { Component, inject, OnInit, signal } from '@angular/core';
import { LeitoService } from '../../services/leito.service';
import { CriarLeitoRequest, LeitoResponse } from '../../models/leito.models';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Setor } from '../../../setores/services/setor';
import { SetorResponse } from '../../../setores/models/setor.models';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

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
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './leitos.html',
  styleUrl: './leitos.scss',
})
export class Leitos implements OnInit {
  private leitoService = inject(LeitoService);
  private setorService = inject(Setor)
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

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

  visible: boolean = false;

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


  formLeito = new FormGroup({
    codigo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ]
    }),

    setor_id: new FormControl<number | null>(
      null,
      Validators.required
    )
  });

  leitoEmEdicao = signal<LeitoResponse | null>(null)

  abrirCriacao() {
    this.leitoEmEdicao.set(null)
    this.formLeito.reset({codigo: '', setor_id: null});
    this.visible = true;
  }

  abrirEdicao(leito: LeitoResponse) {
    this.leitoEmEdicao.set(leito);
    this.formLeito.reset({ codigo: leito.codigo, setor_id: leito.setor_id });
    this.visible = true;
  }

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
        this.carregarLeitos();
      },
      error: (erro) => console.error(erro)
    });
    }


    // id do leito que está com requisição em andamento (evita clique duplo)
    processandoId = signal<number | null>(null);

    alterarSituacao(leito: LeitoResponse) {
      // Ativar é seguro: envia direto
      if (!leito.ativo) {
        this.enviarAlteracaoSituacao(leito, true);
        return;
      }

      // Desativar tira o leito de operação: pede confirmação antes
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

    private enviarAlteracaoSituacao(leito: LeitoResponse, ativo: boolean) {
      this.processandoId.set(leito.id);

      this.leitoService.alterarSituacao(leito.id, ativo)
        .pipe(finalize(() => this.processandoId.set(null)))
        .subscribe({
          next: (atualizado) => {
            // troca só o leito alterado na lista, sem novo GET
            this.leitos.update(lista =>
              lista.map(l => l.id === atualizado.id ? atualizado : l)
            );

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Leito ${atualizado.codigo} ${atualizado.ativo ? 'ativado' : 'desativado'}.`
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
