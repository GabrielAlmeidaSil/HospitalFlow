import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Paciente } from '../../services/paciente.service';
import { CriarPacienteRequest, FiltrosPaciente, PacienteResponse, ResumoPacientesResponse, PacienteListagemResponse } from '../../models/paciente.models';

@Component({
  selector: 'app-pacientes',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    DialogModule
  ],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class Pacientes implements OnInit {
  busca = signal('');
  carregando = signal(false);
  situacaoSelecionada = signal<boolean | null>(null);
  pacientes = signal<PacienteListagemResponse[]>([])

  //INJECAO DE SERVICES
  private pacienteService = inject(Paciente)


  //RESUMO CARDS
  resumo = signal<ResumoPacientesResponse>({
    total: 0,
    ativos: 0,
    inativos: 0
  });

  
  //OPÇÕES DE SITUAÇÕES
  situacaoOpcoes: {
    nome: string;
    valor: boolean | null;
  }[] = [
    {
      nome: 'Todos',
      valor: null
    },
    {
      nome: 'Ativos',
      valor: true
    },
    {
      nome: 'Inativos',
      valor: false
    }
  ];


  ngOnInit(): void {
    this.atualizarDados()
  }

  atualizarDados() {
    this.listarPacientes();
    this.carregarResumo();
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


  formatarCpf(cpf: string): string {
    return cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }

  //FORMATAR DATA PARA (DD-MM-YYYY)
  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }

  //FORMULARIO DE CRIAR NOVO PACIENTE
  pacienteEmEdicao = signal<PacienteResponse | null>(null);
  visible: boolean = false;

  formPaciente = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120)
      ]
    }),

    cpf: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^\d{11}$/)
      ]
    }),

    data_nascimento: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    })
  })

  // ABRE O MODAL VAZIO
  abrirCriacao() {
    this.pacienteEmEdicao.set(null);
    this.formPaciente.reset({ nome: '', cpf: '', data_nascimento: '' });
    this.visible = true;
  }

  // ABRE O MODAL PREENCHIDO
  abrirEdicao(paciente: PacienteResponse) {
    this.pacienteEmEdicao.set(paciente);
    this.formPaciente.reset({ nome: paciente.nome, cpf: paciente.cpf, data_nascimento: paciente.data_nascimento });
    this.visible = true;
  }

  // CRIA OU EDITA O PACIENTE
  salvar() {
    if (this.formPaciente.invalid) {
      this.formPaciente.markAllAsTouched();
      return;
    }

    const { nome, cpf, data_nascimento } = this.formPaciente.getRawValue();

    const dados: CriarPacienteRequest = { nome: nome.trim(), cpf, data_nascimento };
    const paciente = this.pacienteEmEdicao();

    const requisicao = paciente
      ? this.pacienteService.editar(paciente.id, dados)
      : this.pacienteService.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.visible = false;
        this.atualizarDados();
      },
      error: (erro) => console.error(erro)
    });
  }


  listarPacientes() {
    this.carregando.set(true);

    const filtros: FiltrosPaciente = {};

    const busca = this.busca().trim();

    if (busca) {
      filtros.busca = busca
    }

    const ativo = this.situacaoSelecionada();

    if (ativo !== null) {
      filtros.ativo = ativo;
    }

    this.pacienteService.listar(filtros).subscribe({
      next: (pacientes) => {
        this.pacientes.set(pacientes);
        this.carregando.set(false)
      },

      error: (erro) => {
        console.error(erro);
        this.carregando.set(false);
      }

    });
  }


  carregarResumo() {
    this.pacienteService.resumo().subscribe({
      next: (resumo) => {
        this.resumo.set(resumo)
      },

      error: (erro) => {
        console.error('Erro ao carregar resumo: ', erro)
      }

    });
  }


  alterarSituacao(paciente: PacienteResponse) {
    this.pacienteService.alterarSituacao(paciente.id, !paciente.ativo).subscribe({
      next: () => this.atualizarDados(),
      error: (erro) => console.error(erro)
    })
  }
}
