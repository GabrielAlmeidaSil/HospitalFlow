import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OcorrenciasService } from '../../services/ocorrencias.service';
import { ResumoOcorrenciasResponse } from '../../models/ocorrencias.models';
import { StatusPrioridade } from '../../models/ocorrencias.models';
import { StatusOcorrencia } from '../../models/ocorrencias.models';
import { OcorrenciaResponse } from '../../models/ocorrencias.models';
import { FiltrosOcorrencia } from '../../models/ocorrencias.models';
import { Setor } from '../../../setores/services/setor';
import { SetorResponse } from '../../../setores/models/setor.models';

@Component({
  selector: 'app-ocorrencias',
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
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './ocorrencias.html',
  styleUrl: './ocorrencias.scss',
})
export class Ocorrencias implements OnInit {

  ocorrenciaService = inject(OcorrenciasService)
  setorService = inject(Setor)
  messageService = inject(MessageService)

  resumoOcorrencia = signal<ResumoOcorrenciasResponse>({
    abertas: 0,
    em_resolucao: 0,
    criticas_pendentes: 0,
    resolvidas_hoje: 0
  })

  carregando = signal(false)

  atualizarDados() {
    this.carregarTabela()
    this.carregarResumo()
  }

  ngOnInit(): void {
    this.carregarSetores()
    this.atualizarDados()
  }

  //FILTROS
  busca = signal('')
  setorSelecionado = signal<number | null>(null)
  prioridadeSelecionada = signal<StatusPrioridade | null>(null)
  statusSelecionado = signal<StatusOcorrencia | null>(null)
  setores = signal<SetorResponse[]>([])

  prioridadeOpcoes: { nome: string; valor: StatusPrioridade | null }[] = [
    { nome: 'Todas', valor: null },
    { nome: 'Baixa', valor: 'baixa' },
    { nome: 'Média', valor: 'media' },
    { nome: 'Alta', valor: 'alta' },
    { nome: 'Crítica', valor: 'critica' }
  ]

  statusOpcoes: { nome: string; valor: StatusOcorrencia | null }[] = [
    { nome: 'Todos', valor: null },
    { nome: 'Aberta', valor: 'aberta' },
    { nome: 'Em resolução', valor: 'em_resolucao' },
    { nome: 'Resolvida', valor: 'resolvida' }
  ]


  //OCORRENCIAS
  ocorrencias = signal<OcorrenciaResponse[]>([])

  carregarTabela() {
    this.carregando.set(true)

    const filtros: FiltrosOcorrencia = {}

    const busca = this.busca().trim();
    const setor = this.setorSelecionado();
    const prioridade = this.prioridadeSelecionada();
    const status = this.statusSelecionado();

    if (busca) {
      filtros.busca = busca;
    }

    if (setor !== null) {
      filtros.setor_id = setor;
    }

    if (prioridade !== null) {
      filtros.prioridade = prioridade;
    }

    if (status !== null) {
      filtros.status = status;
    }

    this.ocorrenciaService.listar(filtros).subscribe({
      next: (ocorrencias) => {
        this.ocorrencias.set(ocorrencias);
        this.carregando.set(false);
      },

      error: (erro) => {
        console.error('Erro ao carregar tabela: ', erro);
        this.carregando.set(false);
      }
    })
  }


  carregarResumo() {
    this.ocorrenciaService.resumo().subscribe({
       next: (resumo_ocorrencias) => {
        this.resumoOcorrencia.set(resumo_ocorrencias)
       },

       error: (erro) => {
        console.error("Erro ao carregar resumo de ocorrencias: ", erro)
       }
    })
  }


  carregarSetores() {
    this.setorService.listarSetores().subscribe({
      next: (setores) => {
        this.setores.set(setores)
      },

      error: (erro) => {
        console.error("Erro ao carregar setores: ", erro)
      }
    })
  }


  //NOVA OCORRENCIA
  visibleNova: boolean = false

  prioridadesNova: { nome: string; valor: StatusPrioridade }[] = [
    { nome: 'Baixa', valor: 'baixa' },
    { nome: 'Média', valor: 'media' },
    { nome: 'Alta', valor: 'alta' },
    { nome: 'Crítica', valor: 'critica' }
  ]

  formNova = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]),
    descricao: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]),
    prioridade: new FormControl<StatusPrioridade | null>(null, Validators.required),
    setor_id: new FormControl<number | null>(null, Validators.required)
  })

  abrirNova() {
    this.formNova.reset({ titulo: '', descricao: '', prioridade: null, setor_id: null })
    this.visibleNova = true
  }

  salvarNova() {
    if (this.formNova.invalid) {
      this.formNova.markAllAsTouched()
      return
    }

    const { titulo, descricao, prioridade, setor_id } = this.formNova.getRawValue()
    if (!titulo || !descricao || prioridade === null || setor_id === null) return

    this.ocorrenciaService.criar({ titulo, descricao, prioridade, setor_id }).subscribe({
      next: () => {
        this.visibleNova = false
        this.atualizarDados()

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ocorrência criada.'
        })
      },

      error: (erro) => {
        console.error("Erro ao criar ocorrencia: ", erro)

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar a ocorrência.'
        })
      }
    })
  }


  mostrarErro(erro: any, mensagemPadrao: string) {
    const detail = erro.error?.detail

    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: typeof detail === 'string' ? detail : mensagemPadrao
    })
  }


  //OCORRENCIA ESCOLHIDA NA TABELA
  ocorrenciaSelecionada = signal<OcorrenciaResponse | null>(null)


  //DETALHES
  visibleDetalhes: boolean = false

  abrirDetalhes(ocorrencia: OcorrenciaResponse) {
    this.ocorrenciaSelecionada.set(ocorrencia)
    this.visibleDetalhes = true
  }


  //ASSUMIR
  assumirOcorrencia(ocorrencia: OcorrenciaResponse) {
    this.ocorrenciaService.assumir(ocorrencia.id).subscribe({
      next: () => {
        this.atualizarDados()

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Você assumiu a ocorrência.'
        })
      },

      error: (erro) => {
        console.error("Erro ao assumir ocorrencia: ", erro)
        this.mostrarErro(erro, 'Não foi possível assumir a ocorrência.')
      }
    })
  }


  //RESOLVER
  visibleResolver: boolean = false

  formResolver = new FormGroup({
    descricao_resolucao: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)])
  })

  abrirResolver(ocorrencia: OcorrenciaResponse) {
    this.ocorrenciaSelecionada.set(ocorrencia)
    this.formResolver.reset({ descricao_resolucao: '' })
    this.visibleResolver = true
  }

  salvarResolver() {
    if (this.formResolver.invalid) {
      this.formResolver.markAllAsTouched()
      return
    }

    const ocorrencia = this.ocorrenciaSelecionada()
    const { descricao_resolucao } = this.formResolver.getRawValue()
    if (ocorrencia === null || !descricao_resolucao) return

    this.ocorrenciaService.resolver(ocorrencia.id, { descricao_resolucao }).subscribe({
      next: () => {
        this.visibleResolver = false
        this.atualizarDados()

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ocorrência resolvida.'
        })
      },

      error: (erro) => {
        console.error("Erro ao resolver ocorrencia: ", erro)
        this.mostrarErro(erro, 'Não foi possível resolver a ocorrência.')
      }
    })
  }

}
